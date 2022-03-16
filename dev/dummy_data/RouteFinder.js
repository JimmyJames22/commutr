const fs = require("fs");
const { format } = require("path");

let student_raw = fs.readFileSync("./data/student.json");
let driver_raw = fs.readFileSync("./data/driver.json");
let school_raw = fs.readFileSync("./data/school.json");

let student_data = JSON.parse(student_raw);
let driver_data = JSON.parse(driver_raw);
let school_data = JSON.parse(school_raw);

let users = [];
let drivers = [];
let students = [];
let dist;
let i;
let j;

let routeTolerance = 2; // maximum of 115% original commute time for drivers

let userMap = [];

let routeList = [];

class User {
  constructor(user) {
    this.x = user.x;
    this.y = user.y;
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.class_year = user.class_year;
    this.email = user.email;
    this.phone = user.phone;
    this.uid = user.uid;
    this.is_driver = user.is_driver;
    this.to_school = Math.sqrt(
      Math.pow(this.x - school_data.x, 2) + Math.pow(this.y - school_data.y, 2)
    );
    this.route = [];
  }

  distanceToUser(user) {
    return Math.sqrt(
      Math.pow(this.x - user.x, 2) + Math.pow(this.y - user.y, 2)
    );
  }

  distanceToUid(uid) {
    let map;
    for (let k = 0; k < userMap.length; k++) {
      map = userMap[k];
      if (map.u1 == this.uid && map.u2 == uid) {
        return map.distance;
      } else if (map.u1 == uid && map.u2 == this.uid) {
        return map.distance;
      }
    }
    return 0;
  }
}

for (i = 0; i < driver_data.length; i++) {
  let user = new User(driver_data[i]);
  users.push(user);
  drivers.push(user);
}

for (i = 0; i < student_data.length; i++) {
  let user = new User(student_data[i]);
  users.push(user);
  students.push(user);
}

const num_users = users.length;

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
}

processDistances();

// console.log(users);
// console.log(userMap);
// console.log(users[3].distanceToUid(4));

function formRoutes(route) {
  var repeat = false;
  var last_stop = route.last_stop;
  var student;
  for (var x = 0; x < students.length; x++) {
    // check for repeat passengers
    // ! PROBLEM CODE -- ALWAYS ADDING THE SAME USER
    for (var y = 0; y < route.stops.length; y++) {
      if (x === route.stops[y]) {
        repeat = true;
        break;
      }
    }
    if (repeat) {
      repeat = false;
      continue;
    }

    student = students[x];
    if (
      route.max_dist >
      last_stop.distanceToUid(student.uid) +
        route.last_stop_dist +
        student.to_school
    ) {
      console.log(
        "Calling formRoutes: " +
          route.stops +
          ", " +
          route.max_dist +
          ", " +
          (route.last_stop_dist +
            route.last_stop.distanceToUid(student.uid) +
            student.to_school)
      );
      route.last_stop_dist =
        last_stop.distanceToUid(student.uid) + route.last_stop_dist;
      route.total_dist =
        last_stop.distanceToUid(student.uid) +
        route.last_stop_dist +
        student.to_school;
      route.last_stop = student;
      route.stops.push(student.uid);
      formRoutes(route);
    } else {
      console.log("Route found: " + route.stops);
      return route;
    }
  }
}

function initRoutes() {
  // init variables
  let driver;
  let student;
  let max_driver_dist;
  // loop through drivers
  for (i = 0; i < drivers.length; i++) {
    driver = drivers[i];
    max_driver_dist = driver.to_school * routeTolerance; // maximum distance for a driver
    // check each student per driver
    for (j = 0; j < students.length - 1; j++) {
      student = students[j];
      // check if the route with the student is within the max driver dist
      if (
        max_driver_dist >
        driver.distanceToUid(student.uid) + student.to_school
      ) {
        // initialize a route object
        let route = {
          driver: driver.uid,
          max_dist: max_driver_dist,
          last_stop: student,
          last_stop_dist: driver.distanceToUid(student.uid),
          total_dist: driver.distanceToUid(student.uid) + student.to_school,
          stops: [driver.uid, student.uid],
        };
        routeList.push(formRoutes(route)); // call recursive method
      }
    }
  }
}

initRoutes();

// console.log(routeList);

/*
  *- Start by looping through all drivers and checking which users have a route less that adds 15% or less distance to their route to school
  ?- If there is, store the potential route and check if there are any other passengers along the way that can be picked up and add less than 15% of the distance
   - Store the potential routes and return the one that picks up the most passengers (1) and has the least increase in distance for the driver (2)
*/
