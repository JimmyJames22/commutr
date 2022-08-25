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

let num_clusters = 0;

for (let i = 0; i < user_list.length; i++) {
  // user_plot_list.push({
  //   x: user_list[i].lng,
  //   y: user_list[i].lat,
  // });
  if (user_list[i].cluster > num_clusters) {
    num_clusters = user_list[i].cluster;
  }
}

let cluster_lists = [];

for (let i = 0; i < num_clusters; i++) {
  let cluster = [];
  for (let j = 0; j < user_list.length; j++) {
    if (user_list[j].cluster == i) {
      cluster.push({
        x: user_list[j].lng,
        y: user_list[j].lat,
      });
    }
  }
  cluster_lists.push(cluster);
}

for (let i = 0; i < cluster_lists.length; i++) {
  dataset_list.push({
    label: "Cluster " + i,
    data: cluster_lists[i],
    backgroundColor:
      "rgba(" +
      Math.floor(Math.random() * 255) +
      "," +
      Math.floor(Math.random() * 255) +
      "," +
      Math.floor(Math.random() * 255) +
      ",1)",
    pointRadius: 5,
    fill: false,
  });
}

console.log(cluster_lists);
console.log(dest_plot_list);

dataset_list.push({
  label: "Destinations",
  data: dest_plot_list,
  backgroundColor: "rgba(255, 122, 122, 1)",
  pointRadius: 15,
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
