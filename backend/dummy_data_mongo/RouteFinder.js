// imports
const fs = require("fs");
const { format, resolve } = require("path");
const { stringify } = require("querystring");
const User = require("./supporters/User.js");
const { encode } = require("@googlemaps/polyline-codec");
const axios = require("axios");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectID;

// const {
//   calcEfficiency,
//   sumEfficiency,
// } = require("./supporters/CalcEfficiency.js");
const { rejects } = require("assert");

// init global environment
const API_KEY = "AIzaSyCiN6uQWhP-Di1Lnwn63aw8tQJKUD-amPA";
const mongo_uri =
  "mongodb+srv://gumba:COiUaIcaegjHWO41@cluster0.kiwky.mongodb.net/dummyData?retryWrites=true&w=majority";
const client = new MongoClient(mongo_uri);

let dest_data = {
  _id: "6276c1571c5ff58e410661c2",
  place_id: "ChIJ0VjiTT9844kRBLc0QGPqwrY",
};

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
let route_promises = [];

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

async function init() {
  let student_ids = [];
  try {
    await client.connect();
    console.log("Mongo connected");
    let cursor = await client.db("dummyData").collection("users").find({
      destination_id: dest_data._id,
    });

    let results = await cursor.toArray();
    console.log("RESULTS");
    console.log(results);

    for (let i = 0; i < results.length; i++) {
      let result = results[i];
      console.log(result);
      let user;
      let user_obj = {
        place_id: result.place_id,
        lng: result.lat_lng[0],
        lat: result.lat_lng[1],
        is_driver: result.isDriver,
        uid: result._id.toString(),
        to_school: result.to_school,
        arrival_times: result.arrivalTimes,
        departure_times: result.departureTimes,
      };
      if (result.isDriver) {
        user_obj.max_stops = result.carCapacity;
        user_obj.max_dur = result.max_dur;
        user = new User(user_obj);
        console.log("Driver");
        console.log(user);
        users.push(user);
        drivers.push(user);
        user.makeFirstRoute();
        effList.push(user.best_route.efficiency);
      } else {
        user = new User(user_obj);
        users.push(user);
        students.push(user);
        student_ids.push(user.uid);
      }
    }
  } catch (e) {
    console.error(e);
  }

  for (let i = 0; i < drivers.length; i++) {
    drivers[i].possible_stops = student_ids.slice(0);
  }

  console.log(student_ids);
  console.log("Finished init()");
  console.log(users);
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
      route_promises = [];
      randomRoutes();
      Promise.all(route_promises).then(() => {
        checkIfBetter();
      });
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
    route_promises.push(
      new Promise(async (resolve, reject) => {
        driver = drivers[i];

        if (driver.to_school == -1) {
          driver.new_route = driver.best_route;
          resolve("driver " + i + ": no possible routes");
        } else {
          if (driver.possible_route_stops.length < driver.max_stops) {
            num_stops = Math.ceil(
              Math.random() * driver.possible_route_stops.length
            );
          } else {
            num_stops = Math.ceil(Math.random() * driver.max_stops);
          }

          new_route = await randomStops(num_stops, driver);

          // console.log("RandomRoutes " + driver.uid);

          // can't be recursive or it will max out the stack size
          while (new_route.total_dur >= driver.max_dur) {
            if (driver.possible_route_stops.length < driver.max_stops) {
              num_stops = Math.ceil(
                Math.random() * driver.possible_route_stops.length
              );
            }

            new_route = await randomStops(num_stops, driver);
            // console.log("RandomDriv " + driver.uid);
          }

          driver.new_route = new_route;
          resolve("driver " + i + ": new route created");
        }
      })
    );
  }

  new_efficiency = sumEfficiency(drivers);
}

async function randomStops(num_stops, driver) {
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

      stop_user.duration;

      // check if the proposed stop makes the route unreachable by the driver
      let new_dur =
        new_route.total_dur +
        (await stop_user.durationToUid(
          new_route.stops_by_uid[new_route.stops_by_uid.length - 1],
          client
        )) +
        stop_user.to_school;

      if (new_dur > driver.max_dur) {
        over_duration = true;
        // check if the new stop is over distance and if so remove it from the driver's list
        if (
          (await driver.durationToUid(stop_uid, client)) + stop_user.to_school >
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
    new_route.total_dur += await stop_user.durationToUid(
      new_route.stops_by_uid[new_route.stops_by_uid.length - 2],
      client
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
