const fs = require("fs");
const { format } = require("path");
const { stringify } = require("querystring");
const User = require("./supporters/User.js");
const Time = require("./supporters/Time.js");
const calcEfficiency = require("./supporters/CalcEfficiency.js");

let student_raw = fs.readFileSync("./data/student.json");
let driver_raw = fs.readFileSync("./data/driver.json");
let school_raw = fs.readFileSync("./data/school.json");

let student_data = JSON.parse(student_raw);
let driver_data = JSON.parse(driver_raw);

let users = [];
let drivers = [];
let students = [];

let route_dist_tolerance = 1.5; // maximum multiple of original commute time for drivers

let userMap = [];
let routeList = [];
let bestRoutesList = [];

let best_efficiency = 0;

let effList = [];

let counter = 0;

//! list of functions to run
init();
for (let j = 0; j < 100000; j++) {
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

for (let i = 0; i < effList.length; i++) {
  console.log("Driver " + i + ": " + effList[i][effList[i].length - 1]);
  console.log(drivers[i].best_route.stops_by_uid);
}

function init() {
  for (i = 0; i < driver_data.length; i++) {
    let user = new User(driver_data[i], route_dist_tolerance);
    users.push(user);
    drivers.push(user);
    effList.push([user.best_route.efficiency]);
    best_efficiency += user.best_route.efficiency;
  }

  let student_ids = [];

  for (let i = 0; i < student_data.length; i++) {
    let user = new User(student_data[i], route_dist_tolerance);
    student_ids.push(users.length);
    users.push(user);
    students.push(user);
  }

  processDistances();

  console.log(student_ids);

  for (let i = 0; i < drivers.length; i++) {
    drivers[i].possible_stops = student_ids.slice(0);
  }

  console.log("Finished init()");
}

function processDistances() {
  for (let k = 0; k < users.length; k++) {
    for (let l = k + 1; l < users.length; l++) {
      userMap.push({
        u1: users[k].uid,
        u2: users[l].uid,
        distance: users[k].distanceToUser(users[l]),
      });
    }
  }

  console.log(userMap);
  console.log("Finished processDistances()");
}

//! CODE GETTING STUCK HERE
function randomRoutes() {
  let driver;
  let num_stops;
  let new_route;
  for (let i = 0; i < drivers.length; i++) {
    driver = drivers[i];

    if (driver.possible_stops.length < driver.max_stops) {
      num_stops = Math.ceil(Math.random() * driver.possible_stops.length);
    } else {
      num_stops = Math.ceil(Math.random() * driver.max_stops);
    }

    new_route = randomStops(num_stops, driver);

    // console.log("RandomRoutes " + driver.uid);

    // can't be recursive or it will max out the stack size
    while (new_route.total_dist >= driver.max_dist) {
      if (driver.possible_stops.length < driver.max_stops) {
        num_stops = Math.ceil(Math.random() * driver.possible_stops.length);
      }

      new_route = randomStops(num_stops, driver);
      // console.log("RandomDriv " + driver.uid);
    }

    new_route.efficiency = calcEfficiency(
      driver.max_dist - new_route.total_dist,
      new_route.stops
    );

    driver.new_route = new_route;
    // console.log("RandomRoutes " + driver.possible_stops);
  }
}

function randomStops(num_stops, driver) {
  let new_route = {
    stops: [driver.driver_stop_object],
    stops_by_uid: [driver.uid],
    total_dist: 0,
  };

  if (driver.possible_stops.length == 0) {
    new_route.total_dist = driver.to_school;
    return new_route;
  }

  for (let j = 0; j < num_stops; j++) {
    let stop_uid;
    let invalid_stop = true;
    let stop_in_route = false;
    let over_distance = false;
    let updated_stop_number = false;

    let try_counter = 0;

    // randomly select a new stop for the route and validate it
    while (invalid_stop) {
      //! POSSIBLE STOPS ARRAY NOT SHRINKING
      // stop_uid works
      stop_uid =
        driver.possible_stops[
          Math.ceil(Math.random() * driver.possible_stops.length) - 1
        ];

      // console.log("PS " + driver.possible_stops);

      // check if the stop is within the route already
      for (let i = 0; i < new_route.stops_by_uid.length; i++) {
        if (new_route.stops_by_uid[i] == stop_uid) {
          stop_in_route = true;
          break;
        }
      }

      // check if the proposed stop makes the route unreachable by the driver
      let new_dist =
        new_route.total_dist +
        users[stop_uid].distanceToUid(
          new_route.stops_by_uid[new_route.stops_by_uid.length - 1],
          userMap
        ) +
        users[stop_uid].to_school;

      if (new_dist > driver.max_dist) {
        over_distance = true;
        // check if the new stop is over distance and if so remove it from the driver's list
        if (
          driver.distanceToUid(stop_uid, userMap) + users[stop_uid].to_school >
          driver.max_dist
        ) {
          for (let i = 0; i < driver.possible_stops.length; i++) {
            if (driver.possible_stops[i] == stop_uid) {
              driver.possible_stops.splice(i, 1);
              // return if no more possible stops
              if (driver.possible_stops.length == 0) {
                return {
                  stops: [driver.driver_stop_object],
                  stops_by_uid: [driver.uid],
                  total_dist: driver.to_school,
                };
                // reset num_stops if impacted by reduction in driver.possible_stops size
              } else if (driver.possible_stops.length < driver.max_stops) {
                num_stops -= 1;
                updated_stop_number = true;
              }
              break;
            }
          }
        }
      }

      if (updated_stop_number && new_route.stops.length == num_stops) {
        new_route.total_dist +=
          users[new_route.stops_by_uid[new_route.stops.length - 1]].to_school;
        return new_route;
      } else if (stop_in_route || over_distance) {
        stop_in_route = false;
        over_distance = false;

        if (try_counter > driver.possible_stops.length * 4) {
          new_route.total_dist +=
            users[new_route.stops_by_uid[new_route.stops.length - 1]].to_school;
          return new_route;
        }

        try_counter++;
      } else {
        invalid_stop = false;
      }
    }

    // stop for route selected -- now check to make sure the stop is within the route tollerance
    new_route.stops_by_uid.push(stop_uid);
    new_route.stops.push(users[stop_uid]);
    new_route.total_dist += users[stop_uid].distanceToUid(
      new_route.stops_by_uid[new_route.stops_by_uid.length - 2],
      userMap
    );
  }

  new_route.total_dist +=
    users[new_route.stops_by_uid[new_route.stops.length - 1]].to_school;
  return new_route;
}

function checkIfBetter() {
  let driver;
  for (let i = 0; i < drivers.length; i++) {
    driver = drivers[i];
    if (driver.new_route.efficiency > driver.best_route.efficiency) {
      driver.best_route = driver.new_route;
      effList[i].push(driver.new_route.efficiency);
    }
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
