const fs = require("fs");
const names = require("./rand_names/names").names;
const axios = require("axios");

//Establish Mongodb connection

// import canvas for ChartJS
// const ctx = document.getElementById("myChart").getContext("2d");

// set coordinates for Milton Academy
const y = 42.257227602977615;
const x = -71.06995481869149;
const dest_place_id = "ChIJ0VjiTT9844kRBLc0QGPqwrY";

const num_drivers = 1;
const num_passengers = 1;

// parameters for arrival/leaving times
const min_mrn_time = 420;
const mrn_time_span = 180;
const min_aft_time = 900;
const aft_time_span = 240;

let url_requests = [];

const milton_coords = [
  {
    x: x,
    y: y,
  },
];

const milton_list = {
  _id: "6276c1571c5ff58e410661c2",
  address: "170 Centre Street",
  name: "Milton Academy" ,
  domain: "@milton.edu",
  lat_lng: [y,x],
  place_id: dest_place_id,
};

const dest_oid = mongo.ObjectId(milton_list._id);

// initialize other variables
let i;
let student_coords = [];
let driver_coords = [];
let student_list = [];
let driver_list = [];
let id_counter = 0;

const len_names = names.length;

const logArr = (arr) => {
  for (i = 0; i < arr.length; i++) {
    console.log(arr[i]);
  }
};

// function for making the data
const makeUsers = () => {
  // calls to the looper function to make users
  looper(num_drivers, 0.1, 0.5, true, driver_coords, driver_list);
  looper(num_passengers, 0.1, 0.4, false, student_coords, student_list);
};

const chooseName = () => {
  return names[Math.floor(Math.random() * len_names)];
};

// looper function
const looper = (num, min, max, is_driver, arr, list) => {
  // initialize variables to save space

  // loop according to params
  for (i = 0; i < num; i++) {
    getPlaceID(min, max, is_driver, arr, list);
    // update array specified in params
  }
};

function getPlaceID(min, max, is_driver, arr, list) {
  let thta;
  let dist;
  let y_delta;
  let x_delta;

  thta = Math.floor(Math.random() * 360);
  dist = Math.random() * max + min;
  y_delta = Math.sin(thta) * dist;
  x_delta = Math.cos(thta) * dist;

  url_requests.push(
    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${
          y + y_delta
        },${x + x_delta}&key=AIzaSyCiN6uQWhP-Di1Lnwn63aw8tQJKUD-amPA`
      )
      .then((response) => {
        console.log(y + y_delta + ", " + (x + x_delta));
        console.log(response.data.results[0].formatted_address);
        console.log(response.data.results[0].place_id);
        makeUserObj(
          response.data.results[0].place_id,
          response.data.results[0].geometry.location.lng,
          response.data.results[0].geometry.location.lat,
          response.data.results[0].formatted_address,
          is_driver,
          arr,
          list
        );
      })
      .catch((error) => {
        console.error(error);
        getPlaceID(min, max, is_driver, arr, list);
      })
  );
}

function makeUserObj(place_id, lng, lat, address, is_driver, arr, list) {
  let user;
  let firstname = chooseName();
  let lastname = chooseName();
  let class_year;
  let car_capacity;

  if (is_driver) {
    car_capacity = Math.ceil(Math.random() * 3) + 2;
    class_year = 2026 - Math.ceil(Math.random() * 3);
  } else {
    car_capacity = -1;
    class_year = 2026 - Math.ceil(Math.random() * 4);
  }

  user = {
    nameFirst: firstname,
    nameLast: lastname,
    place_id: place_id,
    lng_lat: [lng,lat],
    address: address,
    destination_id: dest_oid,
    // dest_place_id: dest_place_id,
    // dest_lng_lat: [x,y],
    // dest_address: "170 Centre Street Milton, MA 02186, USA",
    isDriver: is_driver,
    carCapacity: car_capacity,
    // uid: id_counter,
    phone: Math.ceil(Math.random() * 9999999999),
    arrivalTimes: [],
    departureTimes: [],
    ridesGiven: 0,
    ridesTaken: 0
  };

  id_counter++;

  for (let j = 0; j < 5; j++) {
    storeTimes(user, j);
  }

  user.arrivalTimes.push({ day: "saturday", time: NaN, commuting: false });
  user.arrivalTimes.push({ day: "sunday", time: NaN, commuting: false });
  user.departureTimes.push({ day: "saturday", time: NaN, commuting: false });
  user.departureTimes.push({ day: "sunday", time: NaN, commuting: false });

  user.email =
    firstname.toLowerCase() +
    "_" +
    lastname.toLowerCase() +
    (class_year - 2000) +
    "@milton.edu";
  list.push(user);
}

function storeTimes(user, j) {
  let time;

  if (Math.random() > 0.9) {
    time = -1;
  } else {
    time = Math.random() * mrn_time_span + min_mrn_time;
  }

  if (j == 0) {
    user.arrivalTimes.push({
      day: "monday",
      time: time,
      commuting: true,
    });
  } else if (j == 1) {
    user.arrivalTimes.push({
      day: "tuesday",
      time: time,
      commuting: true,
    });
  } else if (j == 2) {
    user.arrivalTimes.push({
      day: "wednesday",
      time: time,
      commuting: true,
    });
  } else if (j == 3) {
    user.arrivalTimes.push({
      day: "thursday",
      time: time,
      commuting: true,
    });
  } else if (j == 4) {
    user.arrivalTimes.push({
      day: "friday",
      time: time,
      commuting: true,
    });
  }

  if (Math.random() > 0.9) {
    time = -1;
  } else {
    time = Math.random() * aft_time_span + min_aft_time;
  }

  if (j == 0) {
    user.departureTimes.push({
      day: "monday",
      time: time,
      commuting: true,
    });
  } else if (j == 1) {
    user.departureTimes.push({
      day: "tuesday",
      time: time,
      commuting: true,
    });
  } else if (j == 2) {
    user.departureTimes.push({
      day: "wednesday",
      time: time,
      commuting: true,
    });
  } else if (j == 3) {
    user.departureTimes.push({
      day: "thursday",
      time: time,
      commuting: true,
    });
  } else if (j == 4) {
    user.departureTimes.push({
      day: "friday",
      time: time,
      commuting: true,
    });
  }
}

// make the users
makeUsers();

Promise.all(url_requests).then(() => {
  let student_raw = JSON.stringify(student_list);
  let driver_raw = JSON.stringify(driver_list);
  let school_raw = JSON.stringify(milton_list);

  fs.writeFile("./data/student.json", student_raw, "utf8", () => {
    console.log("exported");
  });
  fs.writeFile("./data/driver.json", driver_raw, "utf8", () => {
    console.log("exported");
  });
  fs.writeFile("./data/school.json", school_raw, "utf8", () => {
    console.log("exported");
  });
});
