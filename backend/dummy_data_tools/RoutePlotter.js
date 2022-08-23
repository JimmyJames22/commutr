const ctx = document.getElementById("myChart").getContext("2d");

const y = 42.257227602977615;
const x = -71.06995481869149;

let milton_coords = [
  {
    x: x,
    y: y,
  },
];

let driver_list = [];
let student_list = [];

let driver;
let best_route;
let dataset_list = [];

dataset_list.push({
  labels: ["Destinations"],
  data: dest_list,
  backgroundColor: "rgba(255, 122, 122, 1)",
  pointRadius: 5,
  fill: false,
});

dataset_list.push({
  label: "Drivers",
  data: driver_list,
  backgroundColor: "rgba(122, 122, 255, 1)",
  pointRadius: 5,
  fill: false,
});

dataset_list.push({
  label: "Passengers",
  data: student_list,
  backgroundColor: "rgba(122, 255, 122, 1)",
  pointRadius: 5,
  fill: false,
});

for (let i = 0; i < drivers.length; i++) {
  driver = drivers[i];
  route_coords = [];
  console.log(driver);
  let best_route_stops = driver.best_route.stops;
  best_route = [];
  for (let j = 0; j < best_route_stops.length; j++) {
    best_route.push({
      x: best_route_stops[j].x,
      y: best_route_stops[j].y,
    });
  }
  driver_list.push({ x: driver.x, y: driver.y });

  dataset_list.push({
    data: best_route.concat(milton_coords),
    label: "Driver " + (i + 1) + " Route",
    backgroundColor: "gray",
    pointRadius: 5,
    tension: 0,
    showLine: true,
    fill: false,
  });
}

for (let i = 0; i < students.length; i++) {
  student_list.push({ x: students[i].x, y: students[i].y });
}

var myChart = new Chart(ctx, {
  type: "scatter",
  data: {
    // data to be displayed
    datasets: dataset_list,
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
