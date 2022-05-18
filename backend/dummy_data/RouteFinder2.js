// imports
const fs = require("fs");
const { format, resolve } = require("path");
const { stringify } = require("querystring");
const User = require("./supporters/User.js");
const { encode } = require("@googlemaps/polyline-codec");
const axios = require("axios");

const {
  calcEfficiency,
  sumEfficiency,
} = require("./supporters/CalcEfficiency.js");
const { rejects } = require("assert");

// init global environment
const API_KEY = "AIzaSyCiN6uQWhP-Di1Lnwn63aw8tQJKUD-amPA";

// load and store dummy data
let student_raw = fs.readFileSync("./data/student.json");
let driver_raw = fs.readFileSync("./data/driver.json");
let dest_raw = fs.readFileSync("./data/school.json");
let student_data = JSON.parse(student_raw);
let driver_data = JSON.parse(driver_raw);
let dest_data = JSON.parse(dest_raw);

// init gloval variables
let users = [];
let drivers = [];
let students = [];

let route_time_tolerance = 1.15; // maximum multiple of original commute distance for drivers
let num_epochs = 100000;
let loading_usermap = false; // variable to indicate whether or not the new usermap is calculated each time
// ^ if set to false, it creates a new one from the data; if set to true it loads it from ./data/usermap.json

let setup_map = false;

let userMap = []; // variable that holds all the users and how long it will take to get to others

let best_efficiency = 0;
let new_efficiency = 0;

let effList = [];

let counter = 0;

let init_promises = [];

// begin program

// dummy function to help select users
function getUser(uid) {
  for (let i = 0; i < users.length; i++) {
    if (users[i].uid == uid) {
      return users[i];
    }
  }
}

init();

function init() {
  // init drivers
  for (i = 0; i < driver_data.length; i++) {
    let user = new User(driver_data[i], route_time_tolerance, init_promises);
    users.push(user);
    drivers.push(user);
    effList.push([user.best_route.efficiency]);
  }

  let student_ids = [];

  // init students
  for (let i = 0; i < student_data.length; i++) {
    let user = new User(student_data[i], route_time_tolerance, init_promises);
    student_ids.push(users.length);
    users.push(user);
    students.push(user);
  }

  // make gmaps requesst to populate user_map and user.to_school
  processDistances();

  console.log(student_ids);

  for (let i = 0; i < drivers.length; i++) {
    drivers[i].possible_stops = student_ids.slice(0);
  }

  console.log("Finished init()");
}

function processDistances() {
  // this method creates the sequenced gmaps distance matrix api requests
  // they have to be sequenced because gmaps limits them based on the calculations and it throws errors otherwise
  // init local variables

  // variables updated each itteration
  let dest_coords = [];
  let dest_uids = [];
  let dest_counter = 0;
  let current_rate = [];
  let num_requests = 0;
  let current_user_coords = [];
  let current_user_uids = [];

  // list to store all vars
  let reqs_by_rate = [];
  let all_user_coords = [];

  // loop through all users to all other users and append those requests to current_rate
  for (let k = 0; k < users.length; k++) {
    console.log(users[k].uid);
    for (let l = k + 1; l < users.length; l++) {
      if (dest_counter >= 25) {
        // check if over the limit for the current rate
        // append current rate to reqs_by_rate
        current_rate.push({
          orig_param: "place_id:" + users[k].place_id,
          dest_param: "enc:" + encode(dest_coords) + ":",
          orig_uid: users[k].uid,
          dest_uids: dest_uids.slice(0),
        });

        // increase the number of requests
        num_requests++;

        // reset all per-rate variables
        reqs_by_rate.push(current_rate.slice(0));
        dest_coords = [];
        dest_uids = [];
        current_rate = [];
        dest_counter = 0;
      }

      // update all per-rate variables
      dest_coords.push([users[l].lat, users[l].lng]);
      dest_uids.push(users[l].uid);
      dest_counter++;
    }

    // check for any unadded requests for the specified top-level user
    if (dest_coords.length > 0) {
      // add them to current_rate if necessary
      current_rate.push({
        orig_param: "place_id:" + users[k].place_id,
        dest_param: "enc:" + encode(dest_coords) + ":",
        orig_uid: users[k].uid,
        dest_uids: dest_uids.slice(0),
      });
      dest_coords = [];
      dest_uids = [];

      num_requests++;
    }

    // END OF THE CODE FOR THE USERMAPS -- FOLLOWING CODE FOR USER.TO_SCHOOL

    // check if the length of current_user_coords exceeds the max of the dist matrix api
    if (current_user_coords.length < 25) {
      // if within the bounds, update current_user_coords and current_user_uids
      current_user_coords.push([users[k].lat, users[k].lng]);
      current_user_uids.push(users[k].uid);
    } else {
      // if not update all_user_coords and reset current_user variables
      all_user_coords.push({
        uids: current_user_uids.slice(0),
        polyline: encode(current_user_coords),
      });
      current_user_coords = [[users[k].lat, users[k].lng]];
      current_user_uids = [users[k].uid];
    }
  }

  // update final reqs_by_rate
  reqs_by_rate.push(current_rate.slice(0));

  // update final all_user_coords
  all_user_coords.push({
    uids: current_user_uids.slice(0),
    polyline: encode(current_user_coords),
  });

  // make all the gmaps api requests and process incoming data
  makeUserMapReq(reqs_by_rate, all_user_coords);
}

async function makeUserMapReq(reqs_by_rate, all_user_coords) {
  // checks whether to load data from ./data/usermaps.json or make new data
  // THIS FEATURE IS A DEV TOOL AND SHOULD BE REMOVED FOR PRODUCTION
  if (loading_usermap) {
    // load data from backup file
    userMap = JSON.parse(fs.readFileSync("./data/usermap.json"));
  } else {
    // loop through all the possible requests separated by rate
    for (let i = 0; i < reqs_by_rate.length; i++) {
      for (let j = 0; j < reqs_by_rate[i].length; j++) {
        // make dist matrix api request and add the request promise to init_promises
        init_promises.push(
          axios
            // get gmaps data
            .get(
              `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${reqs_by_rate[i][j].orig_param}&destinations=${reqs_by_rate[i][j].dest_param}&key=${API_KEY}`
            )
            .then((response) => {
              // init environment vars
              let dist;
              let dur;

              // loop through results
              for (let l = 0; l < response.data.rows[0].elements.length; l++) {
                // try reading distance data
                try {
                  dist = response.data.rows[0].elements[l].distance.value;
                } catch (err) {
                  console.log(err.message);
                  dist = -1;
                }

                // try reading duration data
                try {
                  dur = response.data.rows[0].elements[l].duration.value;
                } catch (err) {
                  console.log(err.message);
                  dur = -1;
                }

                // update userMap with new data and the two correct uids
                userMap.push({
                  u1: reqs_by_rate[i][j].orig_uid,
                  u2: reqs_by_rate[i][j].dest_uids[l],
                  dist: dist,
                  dur: dur,
                });
              }
            })
            // catch any errors
            .catch(function (error) {
              console.log(error);
            })
        );
      }
      // sleep to avoid getting rate limited
      await sleep(5000);
      // log rough percent of requests made -- DEV TOOL SHOULD BE REMOVED
      console.log((i / (reqs_by_rate.length - 1)) * 100);
    }
  }

  // loop through user.to_school requests
  for (let i = 0; i < all_user_coords.length; i++) {
    // make user.to_school dist matrix api requests
    init_promises.push(
      axios
        // get gmaps data
        .get(
          `https://maps.googleapis.com/maps/api/distancematrix/json?origins=place_id:${dest_data.place_id}&destinations=enc:${all_user_coords[i].polyline}:&key=${API_KEY}`
        )
        .then((response) => {
          // init environment vars
          let user;

          // loop through all users in the response
          for (let l = 0; l < response.data.rows[0].elements.length; l++) {
            // store user var
            user = users[all_user_coords[i].uids[l]];

            // try to update user.to_school
            try {
              user.to_school = response.data.rows[0].elements[l].duration.value;
            } catch (err) {
              console.log(err.message);
              user.to_school = -1;
            }

            // check if user is driver
            if (user.is_driver == true) {
              // if so try to update max_dur
              try {
                user.max_dur =
                  response.data.rows[0].elements[l].duration.value *
                  route_time_tolerance;
              } catch (err) {
                console.log(err.message);
                user.max_dur = -1;
              }

              // init driver variables
              user.makeFirstRoute();
              // update best_efficiency
              best_efficiency += user.best_route.efficiency;
            }
          }
        })
        // catch any errors
        .catch(function (error) {
          console.log(error);
        })
    );
    // sleep to avoid getting rate limited
    await sleep(5000);
    // log rough percent of requests made -- DEV TOOL SHOULD BE REMOVED
    console.log((i / (all_user_coords.length - 1)) * 100);
  }

  // begin regression training using gmaps data
  runProgram();
}

// NEED TO COMMENT EVERYTHING BELOW THIS COMMENT

function runProgram() {
  Promise.all(init_promises).then(() => {
    console.log("DONE");
    fs.writeFile("./data/usermap.json", JSON.stringify(userMap), "utf8", () => {
      console.log("usermap exported");
    });
    fs.writeFile(
      "./data/users_with_gmaps.json",
      JSON.stringify(users),
      "utf8",
      () => {
        console.log("users exported");
      }
    );

    let possible_stops = [];

    for (let i = 0; i < students.length; i++) {
      possible_stops.push(students[i].uid);
    }

    for (let i = 0; i < drivers.length; i++) {
      drivers[i].possible_stops = possible_stops.slice(0);
      console.log(drivers[i].possible_stops);
    }

    for (let j = 0; j < num_epochs; j++) {
      if (j - 1000 * counter >= 0) {
        counter++;
        // console.log();
        // console.log();
        // console.log();
        // console.log();
        // console.log();
        // console.log();
        console.log(j);
      }
      randomRoutes();
      checkIfBetter();
    }
    saveNewJson();
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomRoutes() {
  let driver;
  let num_stops;
  let new_route;
  for (let i = 0; i < drivers.length; i++) {
    driver = drivers[i];
    driver.possible_route_stops = driver.possible_stops.slice(0);
  }

  for (let i = 0; i < drivers.length; i++) {
    driver = drivers[i];

    if (driver.to_school == -1) {
      driver.new_route = driver.best_route;
      continue;
    }

    if (driver.possible_route_stops.length < driver.max_stops) {
      num_stops = Math.ceil(Math.random() * driver.possible_route_stops.length);
    } else {
      num_stops = Math.ceil(Math.random() * driver.max_stops);
    }

    new_route = randomStops(num_stops, driver);

    // console.log("RandomRoutes " + driver.uid);

    // can't be recursive or it will max out the stack size
    while (new_route.total_dur >= driver.max_dur) {
      if (driver.possible_route_stops.length < driver.max_stops) {
        num_stops = Math.ceil(
          Math.random() * driver.possible_route_stops.length
        );
      }

      new_route = randomStops(num_stops, driver);
      // console.log("RandomDriv " + driver.uid);
    }

    driver.new_route = new_route;
  }

  new_efficiency = sumEfficiency(drivers);
}

function randomStops(num_stops, driver) {
  let new_route = {
    stops: [driver.driver_stop_object],
    stops_by_uid: [driver.uid],
    total_dur: 0,
  };

  if (driver.possible_route_stops.length == 0) {
    new_route.total_dur = driver.to_school;
    return new_route;
  }

  for (let j = 0; j < num_stops; j++) {
    let stop_uid;
    let stop_user;

    let invalid_stop = true;
    let breakout = false;

    let stop_in_route = false;
    let over_duration = false;

    let updated_stop_number = false;

    let try_counter = 0;

    // randomly select a new stop for the route and validate it
    while (invalid_stop) {
      // stop_uid works
      stop_uid =
        driver.possible_route_stops[
          Math.ceil(Math.random() * driver.possible_route_stops.length) - 1
        ];

      stop_user = getUser(stop_uid);

      if (stop_user.to_school == -1) {
        for (let i = 0; i < driver.possible_route_stops.length; i++) {
          if (driver.possible_route_stops[i] == stop_uid) {
            driver.possible_route_stops.splice(i, 1);
            break;
          }
        }

        for (let i = 0; i < driver.possible_stops.length; i++) {
          if (driver.possible_stops[i] == stop_uid) {
            driver.possible_stops.splice(i, 1);
            break;
          }
        }

        if (driver.possible_route_stops.length < num_stops) {
          num_stops = driver.possible_route_stops.length;
          if (new_route.stops.length == num_stops) {
            breakout = true;
          }
        }

        if (breakout) {
          breakout = false;
          break;
        } else {
          continue;
        }
      }
      // console.log("PS " + driver.possible_stops);

      // check if the stop is within the route already
      for (let i = 0; i < new_route.stops_by_uid.length; i++) {
        if (new_route.stops_by_uid[i] == stop_uid) {
          stop_in_route = true;
          break;
        }
      }

      // check if the proposed stop makes the route unreachable by the driver
      let new_dur =
        new_route.total_dur +
        stop_user.durationToUid(
          new_route.stops_by_uid[new_route.stops_by_uid.length - 1],
          userMap
        ) +
        stop_user.to_school;

      if (new_dur > driver.max_dur) {
        over_duration = true;
        // check if the new stop is over distance and if so remove it from the driver's list
        if (
          driver.durationToUid(stop_uid, userMap) + stop_user.to_school >
          driver.max_dur
        ) {
          for (let i = 0; i < driver.possible_stops.length; i++) {
            if (driver.possible_stops[i] == stop_uid) {
              driver.possible_stops.splice(i, 1);
              break;
            }
          }

          for (let i = 0; i < driver.possible_route_stops.length; i++) {
            if (driver.possible_route_stops[i] == stop_uid) {
              driver.possible_route_stops.splice(i, 1);
              // return if no more possible stops
              if (driver.possible_route_stops.length == 0) {
                return {
                  stops: [driver.driver_stop_object],
                  stops_by_uid: [driver.uid],
                  total_dur: driver.to_school,
                };
                // reset num_stops if impacted by reduction in driver.possible_route_stops size
              } else if (
                driver.possible_route_stops.length < driver.max_stops
              ) {
                num_stops -= 1;
                updated_stop_number = true;
              }
              break;
            }
          }
        }
      }

      if (updated_stop_number && new_route.stops.length == num_stops) {
        new_route.total_dur +=
          new_route.stops[new_route.stops.length - 1].to_school;
        return new_route;
      } else if (stop_in_route || over_duration) {
        stop_in_route = false;
        over_duration = false;

        if (try_counter > driver.possible_route_stops.length * 15) {
          new_route.total_dur +=
            new_route.stops[new_route.stops.length - 1].to_school;
          return new_route;
        }

        try_counter++;
      } else {
        invalid_stop = false;
      }
    }

    // stop for route selected -- now check to make sure the stop is within the route tollerance
    new_route.stops_by_uid.push(stop_uid);
    new_route.stops.push(stop_user);
    new_route.total_dur += stop_user.durationToUid(
      new_route.stops_by_uid[new_route.stops_by_uid.length - 2],
      userMap
    );

    for (let i = 0; i < drivers.length; i++) {
      let poss_route_stops = drivers[i].possible_route_stops;
      for (let l = 0; l < poss_route_stops.length; l++) {
        if (stop_uid == poss_route_stops[l]) {
          poss_route_stops.splice(l, 1);
          break;
        }
      }
    }
  }

  new_route.total_dur += new_route.stops[new_route.stops.length - 1].to_school;
  return new_route;
}

function checkIfBetter() {
  if (new_efficiency > best_efficiency) {
    console.log("BETTER ROUTES");
    let driver;
    for (let i = 0; i < drivers.length; i++) {
      driver = drivers[i];
      driver.best_route = driver.new_route;
      effList[i].push(driver.new_route.efficiency);
    }

    best_efficiency = new_efficiency;
  }
}

function saveNewJson() {
  let student_json = JSON.stringify(students);
  let drivers_json = JSON.stringify(drivers);
  fs.writeFile("./final_routes/student.json", student_json, "utf8", () => {
    console.log("exported");
  });
  fs.writeFile("./final_routes/driver.json", drivers_json, "utf8", () => {
    console.log("exported");
  });
}
