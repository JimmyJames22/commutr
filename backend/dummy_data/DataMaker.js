const fs = require("fs");
const names = require("./rand_names/names").names;
const axios = require("axios");

// import canvas for ChartJS
// const ctx = document.getElementById("myChart").getContext("2d");

// set coordinates for Milton Academy
const y = 42.257227602977615;
const x = -71.06995481869149;
const dest_place_id = "ChIJ0VjiTT9844kRBLc0QGPqwrY";

const num_drivers = 5;
const num_passengers = 20;

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
  name: "Milton Academy",
  place_id: dest_place_id,
  lat: y,
  lng: x,
  domain: "@milton.edu",
};

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
    firstname: firstname,
    lastname: lastname,
    place_id: place_id,
    lng: lng,
    lat: lat,
    address: address,
    dest_place_id: dest_place_id,
    dest_lng: x,
    dest_lat: y,
    dest_address: "170 Centre Street Milton, MA 02186, USA",
    is_driver: is_driver,
    class_year: class_year,
    car_capacity: car_capacity,
    uid: id_counter,
    phone: Math.ceil(Math.random() * 9999999999),
    arrival_times: [],
    departure_times: [],
  };

  id_counter++;

  for (let j = 0; j < 5; j++) {
    storeTimes(user, j);
  }

  user.arrival_times.push({ day: "saturday", time: NaN, commuting: false });
  user.arrival_times.push({ day: "sunday", time: NaN, commuting: false });
  user.departure_times.push({ day: "saturday", time: NaN, commuting: false });
  user.departure_times.push({ day: "sunday", time: NaN, commuting: false });

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
    user.arrival_times.push({
      day: "monday",
      time: time,
      commuting: true,
    });
  } else if (j == 1) {
    user.arrival_times.push({
      day: "tuesday",
      time: time,
      commuting: true,
    });
  } else if (j == 2) {
    user.arrival_times.push({
      day: "wednesday",
      time: time,
      commuting: true,
    });
  } else if (j == 3) {
    user.arrival_times.push({
      day: "thursday",
      time: time,
      commuting: true,
    });
  } else if (j == 4) {
    user.arrival_times.push({
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
    user.departure_times.push({
      day: "monday",
      time: time,
      commuting: true,
    });
  } else if (j == 1) {
    user.departure_times.push({
      day: "tuesday",
      time: time,
      commuting: true,
    });
  } else if (j == 2) {
    user.departure_times.push({
      day: "wednesday",
      time: time,
      commuting: true,
    });
  } else if (j == 3) {
    user.departure_times.push({
      day: "thursday",
      time: time,
      commuting: true,
    });
  } else if (j == 4) {
    user.departure_times.push({
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
