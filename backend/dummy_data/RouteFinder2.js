const fs = require("fs");
const { format } = require("path");
const { stringify } = require("querystring");
const User = require("./User.js");
const Time = require("./Time.js");

let student_raw = fs.readFileSync("./data/student.json");
let driver_raw = fs.readFileSync("./data/driver.json");
let school_raw = fs.readFileSync("./data/school.json");

let student_data = JSON.parse(student_raw);
let driver_data = JSON.parse(driver_raw);
let school_data = JSON.parse(school_raw);

let users = [];
let drivers = [];
let students = [];

let num_users;

let route_dist_tolerance = 1.5; // maximum multiple of original commute time for drivers

// weights need to be adjusted to help normalize
let route_stops_weight = 15;
let route_dist_weight = 20;
let arrival_time_weight = 0.01;
let departure_time_weight = 0.01;

let userMap = [];
let routeList = [];
let bestRoutesList = [];

const logArr = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    console.log(arr[i]);
  }
};

class RouteFinder2 {
  constructor() {}

  fillArrays() {
    for (let i = 0; i < driver_data.length; i++) {
      let user = new User(driver_data[i], route_dist_tolerance);
      users.push(user);
      drivers.push(user);
    }

    for (let i = 0; i < student_data.length; i++) {
      let user = new User(student_data[i], route_dist_tolerance);
      users.push(user);
      students.push(user);
    }

    num_users = users.length;

    console.log("Finished fillArrays()");
  }

  processDistances() {
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

  function calcEfficiency(total_dist, stops) {
    let num_stops = stops.length;

    // calc time AADs
    let arrival_ave = 0;
    let departure_ave = 0;
    for (let i = 0; i < num_stops; i++) {
      arrival_ave += stops[i].arrival_time;
      departure_ave += stops[i].departure_time;
    }
    arrival_ave /= num_stops;
    departure_ave /= num_stops;
    let arrival_aad = 0;
    let departure_aad = 0;
    for (let i = 0; i < num_stops; i++) {
      arrival_aad += Math.abs(arrival_ave - stops[i].arrival_time);
      derparture_aad += Math.abs(departure_ave - stops[i].departure_time);
    }
    arrival_aad /= num_stops;
    departure_aad /= num_stops;

    return (
      num_stops * route_stops_weight +
      total_dist * route_dist_weight -
      Math.pow(arrival_aad, 2) * arrival_time_weight -
      Math.pow(departure_aad, 2) * departure_time_weight
    );
  }
}

const RF = new RouteFinder2();
RF.fillArrays();
RF.processDistances();

console.log(drivers);

module.exports = RouteFinder2;
