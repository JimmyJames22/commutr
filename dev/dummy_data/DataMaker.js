// import canvas for ChartJS
const ctx = document.getElementById("myChart").getContext("2d");

// set coordinates for Milton Academy
const y = 42.257227602977615;
const x = -71.06995481869149;

let milton_coords = [
  {
    x: x,
    y: y,
  },
];

// initialize other variables
let i;
let student_list = [];
let driver_list = [];

// function for making the data
const makeUsers = () => {
  // calls to the looper function to make users
  looper(350, 0.1, 0.4, student_list);
  looper(125, 0.1, 0.5, driver_list);

  // print out user lists
  console.log(student_list);
  console.log(driver_list);
};

// looper function
const looper = (num, min, max, arr) => {
  // initialize variables to save space
  let thta;
  let dist;
  let y_delta;
  let x_delta;
  let user;

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
  }
};

// make the users
makeUsers();

// display data to ChartJS scatter plot
var myChart = new Chart(ctx, {
  type: "scatter",
  data: {
    // data to be displayed
    datasets: [
      {
        label: "Milton Academy",
        data: milton_coords,
        backgroundColor: "rgba(255, 122, 122, 1)",
      },
      {
        label: "Drivers",
        data: driver_list,
        backgroundColor: "rgba(122, 122, 255, 1)",
      },
      {
        label: "Passengers",
        data: student_list,
        backgroundColor: "rgba(122, 255, 122, 1)",
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Chart.js Scatter Chart",
      },
    },
  },
});
