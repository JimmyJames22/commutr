const fs = require("fs");
const { format } = require("path");
const { stringify } = require("querystring");
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

let i;
let j;

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
  for (i = 0; i < arr.length; i++) {
    console.log(arr[i]);
  }
};
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
    this.arrival_time = new Time(user.arrival_time);
    this.departure_time = new Time(user.departure_time);

    if (this.is_driver) {
      this.max_passengers = user.car_capacity;
      this.routes = [
        {
          driver: this.uid,
          max_dist: this.to_school * route_dist_tolerance,
          last_stop: {
            x: this.x,
            y: this.y,
            firstname: this.firstname,
            lastname: this.lastname,
            class_year: this.class_year,
            email: this.email,
            phone: this.phone,
            uid: this.uid,
            is_driver: true,
            to_school: this.to_school,
            arrival_time: this.arrival_time,
            departure_time: this.departure_time,
          },
          last_stop_dist: this.to_school,
          total_dist: this.to_school,
          stops: [this.uid],
          arrival_time: 100,
          departure_time: 100,
        },
      ];
      this.best_route;
    }
  }

  distanceToUser(user) {
    // necessary to construct userMap
    return Math.sqrt(
      Math.pow(this.x - user.x, 2) + Math.pow(this.y - user.y, 2)
    );
  }

  distanceToUid(uid) {
    // calls from userMap
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

function arrivalTimeAAD(route) {
  let time_list = [];
  let time_ave = 0;
  let time_aad = 0;

  for (let i = 0; i < route.stops.length; i++) {
    let time = users[route.stops[i]].arrival_time.total_mins;
    time_list.push(time);
    time_ave += time;
  }

  time_ave /= route.stops.length;

  for (let i = 0; i < route.stops.length; i++) {
    time_aad += Math.abs(time_list[i] - time_ave);
  }

  time_aad /= route.stops.length;

  return time_aad;
}

function departureTimeAAD(route) {
  let time_list = [];
  let time_ave = 0;
  let time_aad = 0;

  for (let i = 0; i < route.stops.length; i++) {
    let time = users[route.stops[i]].departure_time.total_mins;
    time_list.push(time);
    time_ave += time;
  }

  time_ave /= route.stops.length;

  for (let i = 0; i < route.stops.length; i++) {
    time_aad += Math.abs(time_list[i] - time_ave);
  }

  time_aad /= route.stops.length;
  return time_aad;
}

processDistances();

function formRoutes(route) {
  let repeat = false;
  let student;
  let route_found = true;
  let last_stop = route.last_stop;

  if (route.stops.length < route.max_stops) {
    for (let x = 0; x < students.length; x++) {
      student = students[x];

      for (let y = 0; y < route.stops.length; y++) {
        if (student.uid == route.stops[y]) {
          repeat = true;
          break;
        }
      }
      if (repeat) {
        repeat = false;
        continue;
      }

      if (
        route.max_dist <
        last_stop.distanceToUid(students[x].uid) +
          route.last_stop_dist +
          students[x].to_school
      ) {
        route_found = false;
        continue;
      }

      formRoutes({
        driver: route.driver,
        max_dist: route.max_dist,
        max_stops: route.max_stops,
        last_stop: student,
        last_stop_dist:
          last_stop.distanceToUid(student.uid) + route.last_stop_dist,
        total_dist:
          last_stop.distanceToUid(student.uid) +
          route.last_stop_dist +
          student.to_school,
        stops: route.stops.concat([student.uid]),
      });
    }

    if (!route_found) {
      route.arrival_time = arrivalTimeAAD(route);
      route.departure_time = departureTimeAAD(route);
      routeList.push(route);
      return;
    }
  } else {
    route.arrival_time = arrivalTimeAAD(route);
    route.departure_time = departureTimeAAD(route);
    routeList.push(route);
    return;
  }
}

function initRoutes() {
  // init variables
  let driver;
  let student;
  let max_driver_dist;
  // loop through drivers

  for (let i = 0; i < drivers.length; i++) {
    console.log("Forming routes for driver " + i);
    driver = drivers[i];
    max_driver_dist = driver.to_school * route_dist_tolerance; // maximum distance for a driver
    // check each student per driver
    for (let j = 0; j < students.length; j++) {
      student = students[j];
      // check if the route with the student is within the max driver dist
      if (
        max_driver_dist >
        driver.distanceToUid(student.uid) + student.to_school
      ) {
        // initialize a route object
        let route = {
          driver: driver.uid,
          max_stops: driver.max_passengers,
          max_dist: max_driver_dist,
          last_stop: student,
          last_stop_dist: driver.distanceToUid(student.uid),
          total_dist: driver.distanceToUid(student.uid) + student.to_school,
          stops: [driver.uid, student.uid],
        };
        formRoutes(route); // call recursive method
      }
    }
  }
}

initRoutes();

// assigns the formed routes to drivers
function storeRoutes() {
  for (i = 0; i < routeList.length; i++) {
    // the first step is the driver id, so the routes can be saved using that
    users[routeList[i].driver].routes.push(routeList[i]);
  }
}

storeRoutes();

// prints out the routes for each driver
function printRoutes() {
  let driver;
  // loop through each driver
  for (i = 0; i < drivers.length; i++) {
    driver = drivers[i];
    console.log("----- DRIVER " + i + " -----");
    // loop through each route
    for (j = 0; j < driver.routes.length; j++) {
      // print out the array the .apply and null are needed to make it print on one line
      console.log.apply(null, driver.routes[j].stops);
    }
    console.log();
  }
}

function findBestRoutes() {
  let layer = 0;
  let route;

  for (i = 0; i < drivers[layer].routes.length; i++) {
    route = drivers[layer].routes[i];
    console.log(
      "EFFFF " +
        (route.max_dist - route.total_dist) * route_dist_weight +
        route.stops.length * route_stops_weight +
        route.arrival_time * arrival_time_weight +
        route.departure_time * departure_time_weight
    );
    bestRoutesRecursion(
      layer + 1,
      [route].slice(),
      parseFloat(
        (route.max_dist - route.total_dist) * route_dist_weight +
          route.stops.length * route_stops_weight -
          (route.arrival_time * arrival_time_weight +
            route.departure_time * departure_time_weight)
      ),
      route.stops.slice()
    );
  }
  console.log(bestRoutesList);
}

function bestRoutesRecursion(layer, driverRoutes, efficiency, passengers) {
  let repeat = false;
  let route;

  for (let j = 0; j < drivers[layer].routes.length; j++) {
    route = drivers[layer].routes[j];

    // check for repeat passengers
    for (let l = 0; l < passengers.length; l++) {
      for (let k = 0; k < route.stops.length; k++) {
        if (passengers[l] == route.stops[k]) {
          repeat = true;
          break;
        }
      }
      if (repeat) {
        break;
      }
    }
    if (repeat) {
      repeat = false;
      continue;
    }
    if (layer < drivers.length - 1) {
      bestRoutesRecursion(
        layer + 1,
        driverRoutes.concat(route),
        parseFloat(
          efficiency +
            (route.max_dist - route.total_dist) * route_dist_weight +
            route.stops.length * route_stops_weight -
            (route.arrival_time * arrival_time_weight +
              route.departure_time * departure_time_weight)
        ),
        passengers.concat(route.stops)
      );
    } else {
      console.log("depp " + route.departure_time);
      bestRoutesList.push({
        routes: driverRoutes.concat(route),
        efficiency: parseFloat(
          efficiency +
            (route.max_dist - route.total_dist) * route_dist_weight +
            route.stops.length * route_stops_weight -
            (route.arrival_time * arrival_time_weight +
              route.departure_time * departure_time_weight)
        ),
        best: false,
      });
    }
  }
}

findBestRoutes();

function chooseBestRoutes() {
  let bestIndex = 0;
  let bestRating = bestRoutesList[0].efficiency;

  for (i = 1; i < bestRoutesList.length; i++) {
    if (bestRating < bestRoutesList[i].efficiency) {
      bestIndex = i;
      bestRating = bestRoutesList[i].efficiency;
    }
  }

  bestRoutesList[bestIndex].best = true;
}

chooseBestRoutes();

function printBestRoutes() {
  let bestIndex;

  for (i = 0; i < bestRoutesList.length; i++) {
    // printRouteArrangement(bestRoutesList[i]);
    if (bestRoutesList[i].best) {
      bestIndex = i;
    }
  }

  printRouteArrangement(bestRoutesList[bestIndex], bestIndex);
  saveBestRoutes(bestRoutesList[bestIndex]);
}

function printRouteArrangement(bestRoutes, num) {
  if (bestRoutes.best) {
    console.log("--- ARRANGEMENT " + (num + 1) + " -- BEST ---");
  } else {
    console.log("--- ARRANGEMENT " + (num + 1) + " ---");
  }
  for (let j = 0; j < bestRoutes.routes.length; j++) {
    route = bestRoutes.routes[j];
    console.log("Driver " + (j + 1) + ": " + route.stops);
  }
  console.log("Efficiency " + bestRoutes.efficiency);
  console.log();
}

printBestRoutes();

function saveBestRoutes(bestRoutes) {
  let new_stops;
  let route;
  let stop;
  for (i = 0; i < drivers.length; i++) {
    new_stops = [];
    drivers[i].bestRoute = bestRoutes.routes[i];
    route = drivers[i].bestRoute;
    for (j = 0; j < route.stops.length; j++) {
      stop = users[route.stops[j]];
      new_stops.push({
        x: stop.x,
        y: stop.y,
      });
    }
    console.log(new_stops);
    route.stops = new_stops;
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

saveNewJson();
