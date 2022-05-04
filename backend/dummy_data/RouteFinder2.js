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

const logArr = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    console.log(arr[i]);
  }
};

fillArrays();
processDistances();
randomRoutes();

function fillArrays() {
  for (i = 0; i < driver_data.length; i++) {
    let user = new User(driver_data[i], route_dist_tolerance);
    users.push(user);
    drivers.push(user);
  }

  for (let i = 0; i < student_data.length; i++) {
    let user = new User(student_data[i], route_dist_tolerance);
    users.push(user);
    students.push(user);
  }
  console.log("Finished fillArrays()");
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

function randomRoutes() {
  let driver;
  let num_stops;
  let new_route;
  for (let i = 0; i < drivers.length; i++) {
    driver = drivers[i];
    num_stops = 1;
    new_route = {
      stops: [driver.driver_stop_object],
      stops_by_uid: [driver.uid],
      total_dist: 0,
    };
    randomStops(num_stops, new_route);
    new_route.total_dist +=
      users[new_route.stops_by_uid[new_route.stops.length - 1]].to_school;
    new_route.efficiency = calcEfficiency(
      new_route.total_dist,
      new_route.stops
    );
    driver.new_route = new_route;
  }
}

function randomStops(num_stops, new_route) {
  for (let j = 0; j < num_stops; j++) {
    let stop_uid =
      Math.ceil(Math.random() * students.length) + (drivers.length - 1);
    new_route.stops_by_uid.push(stop_uid);
    new_route.stops.push(users[stop_uid]);
    new_route.total_dist += users[stop_uid].distanceToUid(
      new_route.stops_by_uid[new_route.stops.length - 2],
      userMap
    );
  }
}
