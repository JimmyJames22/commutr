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

let route_dist_tolerance = 5.5; // maximum multiple of original commute time for drivers

let userMap = [];
let routeList = [];
let bestRoutesList = [];

let best_efficiency = 0;

let effList = [];

//! list of functions to run
init();
processDistances();
for (let j = 0; j < 50; j++) {
  console.log(j);
  randomRoutes();
  checkIfBetter();
}
saveNewJson();

for (let i = 0; i < effList.length; i++) {
  console.log("Driver " + i + ": " + effList[i][effList[i].length - 1]);
}

function init() {
  for (i = 0; i < driver_data.length; i++) {
    let user = new User(driver_data[i], route_dist_tolerance);
    users.push(user);
    drivers.push(user);
    effList.push([user.best_route.efficiency]);
    best_efficiency += user.best_route.efficiency;
  }

  for (let i = 0; i < student_data.length; i++) {
    let user = new User(student_data[i], route_dist_tolerance);
    users.push(user);
    students.push(user);
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

  console.log("Finished processDistances()");
}

//! CODE GETTING STUCK HERE
function randomRoutes() {
  let driver;
  let num_stops;
  let new_route;
  for (let i = 0; i < drivers.length; i++) {
    driver = drivers[i];

    console.log(i + " : " + driver.forbidden_stops);

    num_stops = Math.ceil(Math.random() * driver.max_stops);
    new_route = randomStops(num_stops, driver);

    // can't be recursive or it will max out the stack size
    while (new_route.total_dist > driver.max_dist) {
      new_route = randomStops(num_stops, driver);
    }

    new_route.efficiency = calcEfficiency(
      new_route.total_dist,
      new_route.stops
    );

    driver.new_route = new_route;
  }
}

function randomStops(num_stops, driver) {
  let new_route = {
    stops: [driver.driver_stop_object],
    stops_by_uid: [driver.uid],
    total_dist: 1,
  };

  if (driver.forbidden_stops.length == students.length) {
    new_route.total_dist = driver.to_school;
    return new_route;
  }

  for (let j = 0; j < num_stops; j++) {
    let stop_uid;
    let forbidden = true;
    let in_array = false;

    while (forbidden) {
      stop_uid =
        Math.ceil(Math.random() * students.length) + (drivers.length - 1);
      for (let i = 0; i < driver.forbidden_stops.length; i++) {
        if (driver.forbidden_stops[i] == stop_uid) {
          in_array = true;
        }
      }
      if (in_array) {
        in_array = false;
      } else {
        for (let i = 0; i < new_route.stops_by_uid.length; i++) {
          if (new_route.stops_by_uid[i] == stop_uid) {
            in_array = true;
          }
        }
        if (in_array) {
          in_array = false;
        } else {
          forbidden = false;
        }
      }
    }

    new_route.stops_by_uid.push(stop_uid);
    new_route.stops.push(users[stop_uid]);
    new_route.total_dist += users[stop_uid].distanceToUid(
      new_route.stops_by_uid[new_route.stops.length - 2],
      userMap
    );
    if (new_route.total_dist + users[stop_uid].to_school > driver.max_dist) {
      if (new_route.stops.length == 2) {
        driver.forbidden_stops.push(stop_uid);
      }
      break;
    }
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
