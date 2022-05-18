/** @format */

const fs = require("fs");
const names = require("../dummy_data/rand_names/names").names;
const axios = require("axios");
const mongo = require("mongodb");
const User = require('../models/user');
const e = require('express')

// set coordinates for Milton Academy
const y = 42.257227602977615;
const x = -71.06995481869149;
const dest_place_id = "ChIJ0VjiTT9844kRBLc0QGPqwrY";

const num_drivers = 20; //Change these values
const num_passengers = 5;

// parameters for arrival/leaving times
const min_mrn_time = 420;
const mrn_time_span = 180;
const min_aft_time = 900;
const aft_time_span = 240;
const len_names = names.length;


let i;
let student_coords = [];
let driver_coords = [];
let student_list = [];
let driver_list = [];
let id_counter = 0;

let url_requests = [];

const milton_list = {
  _id: "6276c1571c5ff58e410661c2",
  address: "170 Centre Street",
  name: "Milton Academy",
  domain: "@milton.edu",
  lat_lng: [y, x],
  place_id: dest_place_id,
};

const dest_oid = mongo.ObjectId(milton_list._id);


// const mongoose = require("mongoose");
// const { MongoClient } = require("mongodb");

// const client = new MongoClient(process.env.ATLAS_URI);
// async function main() {
//   await client.connect();
// }

// main();
// const db = client.db();
  
exports.makeUsers = async (req, res) => {
  looper(num_drivers, 0.1, 0.5, true, driver_coords, driver_list);
  looper(num_passengers, 0.1, 0.4, false, student_coords, student_list);
  
  Promise.all(url_requests).then(() => {
    res.json({
      message: "complete"
    })
  })
};

const looper = (num, min, max, is_driver, arr, list) => {
  // initialize variables to save space

  // loop according to params
  for (i = 0; i < num; i++) {
    getPlaceID(min, max, is_driver, arr, list);
    // update array specified in params
  }
};

function chooseName(){
  return names[Math.floor(Math.random() * len_names)];
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

  let nameFirst = firstname;
  let nameLast = lastname;
  let lng_lat = [lng, lat];
  let destination_id = dest_oid;
  // dest_place_id = dest_place_id,
  // dest_lng_lat = [x,y],
  // dest_address = "170 Centre Street Milton, MA 02186, USA",
  let isDriver = is_driver;
  let carCapacity = car_capacity;
  // uid = id_counter,
  let phone = Math.ceil(Math.random() * 9999999999);
  let arrivalTimes = [];
  let departureTimes = [];
  let ridesGiven = 0;
  let ridesTaken = 0;

  id_counter++;

  for (let j = 0; j < 5; j++) {
    storeTimes(arrivalTimes, departureTimes, j);
  }

  arrivalTimes.push({ day: "saturday", time: NaN, commuting: false });
  arrivalTimes.push({ day: "sunday", time: NaN, commuting: false });
  departureTimes.push({ day: "saturday", time: NaN, commuting: false });
  departureTimes.push({ day: "sunday", time: NaN, commuting: false });

  let email =
    firstname.toLowerCase() +
    "_" +
    lastname.toLowerCase() +
    (class_year - 2000) +
    "@milton.edu";

  let userDBObject = new User({
    nameFirst,
    nameLast,
    email,
    destination_id,
    phone,
    arrivalTimes,
    departureTimes,
    address,
    place_id,
    lng_lat,
    isDriver,
    carCapacity,
    ridesTaken,
    ridesGiven,
  });

  userDBObject.save((err, data) => {
    if(err){
      return res.status(400).json({
        error: "Something went wrong during signup", newUser
      })
    }
    
  })
}

function storeTimes(arrivalTimes, departureTimes, j) {
  let time;

  if (Math.random() > 0.9) {
    time = -1;
  } else {
    time = Math.random() * mrn_time_span + min_mrn_time;
  }

  if (j == 0) {
    arrivalTimes.push({
      day: "monday",
      time: time,
      commuting: true,
    });
  } else if (j == 1) {
    arrivalTimes.push({
      day: "tuesday",
      time: time,
      commuting: true,
    });
  } else if (j == 2) {
    arrivalTimes.push({
      day: "wednesday",
      time: time,
      commuting: true,
    });
  } else if (j == 3) {
    arrivalTimes.push({
      day: "thursday",
      time: time,
      commuting: true,
    });
  } else if (j == 4) {
    arrivalTimes.push({
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
    departureTimes.push({
      day: "monday",
      time: time,
      commuting: true,
    });
  } else if (j == 1) {
    departureTimes.push({
      day: "tuesday",
      time: time,
      commuting: true,
    });
  } else if (j == 2) {
    departureTimes.push({
      day: "wednesday",
      time: time,
      commuting: true,
    });
  } else if (j == 3) {
    departureTimes.push({
      day: "thursday",
      time: time,
      commuting: true,
    });
  } else if (j == 4) {
    departureTimes.push({
      day: "friday",
      time: time,
      commuting: true,
    });
  }
}



