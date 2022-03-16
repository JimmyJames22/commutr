const fs = require("fs");
const names = require("./rand_names/names").names;

// import canvas for ChartJS
// const ctx = document.getElementById("myChart").getContext("2d");

// set coordinates for Milton Academy
const y = 42.257227602977615;
const x = -71.06995481869149;

const num_drivers = 5;
const num_passengers = 20;

const milton_coords = [
  {
    x: x,
    y: y,
  },
];

const milton_list = {
  name: "Milton Academy",
  x: x,
  y: y,
};

// initialize other variables
let i;
let student_coords = [];
let driver_coords = [];
let student_list = [];
let driver_list = [];
let id_counter = 0;

const len_names = names.length;

// function for making the data
const makeUsers = () => {
  // calls to the looper function to make users
  looper(num_drivers, 0.1, 0.5, true, driver_coords, driver_list);
  looper(num_passengers, 0.1, 0.4, false, student_coords, student_list);

  // print out user lists
  // console.log(driver_list);
  // console.log(student_list);
};

const chooseName = () => {
  return names[Math.floor(Math.random() * len_names)];
};

// looper function
const looper = (num, min, max, is_driver, arr, list) => {
  // initialize variables to save space
  let thta;
  let dist;
  let y_delta;
  let x_delta;
  let user;
  let firstname;
  let lastname;
  let class_year;

  // loop according to params
  for (i = 0; i < num; i++) {
    // save random distances and angles
    thta = Math.floor(Math.random() * 360);
    dist = Math.random() * max + min;
    y_delta = Math.sin(thta) * dist;
    x_delta = Math.cos(thta) * dist;

    // update array specified in params
    user = {};
    user.x = x + x_delta;
    user.y = y + y_delta;
    arr.push(user);
    firstname = chooseName();
    lastname = chooseName();
    user.firstname = firstname;
    user.lastname = lastname;
    user.is_driver = is_driver;
    user.uid = id_counter;
    id_counter++;
    user.phone = Math.ceil(Math.random() * 9999999999);
    if (is_driver) {
      user.is_driver = true;
      user.car_capacity = Math.ceil(Math.random() * 4);
      class_year = 2026 - Math.ceil(Math.random() * 3);
    } else {
      user.is_driver = false;
      user.car_capacity = -1;
      class_year = 2026 - Math.ceil(Math.random() * 4);
    }
    user.class_year = class_year;
    user.email =
      firstname.toLowerCase() +
      "_" +
      lastname.toLowerCase() +
      (class_year - 2000) +
      "@milton.edu";
    list.push(user);
  }
};

// make the users
makeUsers();

const writeData = () => {
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
};

writeData();

// display data to ChartJS scatter plot
// var myChart = new Chart(ctx, {
//   type: "scatter",
//   data: {
//     // data to be displayed
//     datasets: [
//       {
//         label: "Milton Academy",
//         data: milton_coords,
//         backgroundColor: "rgba(255, 122, 122, 1)",
//       },
//       {
//         label: "Drivers",
//         data: driver_coords,
//         backgroundColor: "rgba(122, 122, 255, 1)",
//       },
//       {
//         label: "Passengers",
//         data: student_coords,
//         backgroundColor: "rgba(122, 255, 122, 1)",
//       },
//     ],
//   },
//   options: {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: "top",
//       },
//       title: {
//         display: true,
//         text: "Chart.js Scatter Chart",
//       },
//     },
//   },
// });
