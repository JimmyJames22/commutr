// ! NOT USEFUL -- REQUIRES RANDOMLY GENERATED CENTROIDS

let dummy_dataset = [];
let num_terms = 100;
let num_dimensions = 5;
let max = 10;

for (let i = 0; i < num_terms; i++) {
  let row = [];
  for (let j = 0; j < num_dimensions; j++) {
    row.push(Math.random() * max);
  }
  dummy_dataset.push(row);
}

let input_data = {
  _ids: ["Alice", "Bob", "Cary", "Doug", "Edna"],
  // dataset: [
  //   [3, 4, 3, 2, 1],
  //   [4, 3, 5, 1, 1],
  //   [3, 5, 3, 3, 3],
  //   [2, 1, 3, 3, 2],
  //   [1, 1, 3, 2, 3],
  // ],
  dataset: dummy_dataset,
};

let dataset = input_data.dataset;

let comulm_maxes = [];
let comulm_mins = [];
let centroids = [];
let epoch_hist = [];
let best_r;
let best_r_index;
let num_epochs = 1;
let epoch_counter = 0;

for (let i = 0; i < dataset[0].length; i++) {
  let min = (max = dataset[0][i]);
  for (let j = 1; j < dataset.length; j++) {
    if (dataset[j][i] > max) {
      max = dataset[j][i];
    }
    if (dataset[j][i] < min) {
      min = dataset[j][i];
    }
  }
  comulm_maxes.push(max);
  comulm_mins.push(min);
}

// console.log(comulm_maxes);
// console.log(comulm_mins);

while (epoch_counter < num_epochs) {
  centroids = [];
  let num_centroids = Math.random() * dataset.length;

  for (let i = 0; i < num_centroids; i++) {
    let centroid = [];
    for (let j = 0; j < dataset[0].length; j++) {
      centroid.push(Math.random() * comulm_maxes[j] + comulm_mins[i]);
    }
    centroids.push({
      coords: centroid,
      cluster: [],
    });
  }

  let centroid_change = true;
  // create initial clusters for random centroids
  while (centroid_change) {
    centroid_change = false;
    for (let i = 0; i < centroids.length; i++) {
      centroids[i].cluster = [];
    }

    for (let i = 0; i < dataset.length; i++) {
      let least_r;
      let least_r_index;
      for (let j = 0; j < centroids.length; j++) {
        let r = 0;
        let centroid_loc = centroids[j].coords;
        for (let l = 0; l < centroid_loc.length; l++) {
          r += Math.pow(centroid_loc[l] + dataset[i][l], 2);
        }
        r = Math.sqrt(r);
        if (j == 0) {
          least_r = r;
          least_r_index = j;
        } else if (r < least_r) {
          least_r = r;
          least_r_index = j;
        }
      }
      centroids[least_r_index].cluster.push(i);
    }

    for (let i = 0; i < centroids.length; i++) {
      if (centroids[i].cluster.length > 0) {
        let centroid = centroids[i].coords;
        let cluster = centroids[i].cluster;
        for (let j = 0; j < centroid.length; j++) {
          let ave = 0;
          for (let l = 0; l < cluster.length; l++) {
            ave += dataset[cluster[l]][j];
          }
          ave /= cluster.length;
          if (ave != centroid[j]) {
            centroid[j] = ave;
            centroid_change = true;
          }
        }
      }
    }
  }

  let net_r = 0;
  let centroid_count = 0;
  for (let i = 0; i < centroids.length; i++) {
    if (centroids[i].cluster.length == 0) {
      continue;
    } else {
      centroid_count++;
    }
    let centroid_r = 0;
    for (let j = 0; j < centroids[i].cluster; j++) {
      let r = 0;
      for (let l = 0; l < centroids[i].coords; l++) {
        r += Math.pow(centroids[i].coords[l] - centroids[i].cluster[j][l], 2);
      }
      centroid_r += Math.sqrt(r);
    }
    net_r += centroid_r / centroids[i].cluster.length;
  }
  net_r /= centroid_count;
  if (epoch_hist.length == 0 || net_r < best_r) {
    best_r = net_r;
    best_r_index = centroids.length;
  }
  epoch_hist.push(centroids);
  epoch_counter++;
}

console.log(epoch_hist[best_r_index]);
