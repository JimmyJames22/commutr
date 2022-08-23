const ctx = document.getElementById("myChart").getContext("2d");

let dataset_list = [];

let dest_plot_list = [];
let user_plot_list = [];

for (let i = 0; i < dest_list.length; i++) {
  dest_plot_list.push({
    x: dest_list[i].lng,
    y: dest_list[i].lat,
  });
}

for (let i = 0; i < user_list.length; i++) {
  user_plot_list.push({
    x: user_list[i].lng,
    y: user_list[i].lat,
  });
}

console.log(user_plot_list);
console.log(dest_plot_list);

dataset_list.push({
  label: "Destinations",
  data: dest_plot_list,
  backgroundColor: "rgba(255, 122, 122, 1)",
  pointRadius: 5,
  fill: false,
});

dataset_list.push({
  label: "Users",
  data: user_plot_list,
  backgroundColor: "rgba(122, 122, 255, 1)",
  pointRadius: 5,
  fill: false,
});

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
