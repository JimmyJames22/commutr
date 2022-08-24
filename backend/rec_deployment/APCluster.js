//?? https://towardsdatascience.com/unsupervised-machine-learning-affinity-propagation-algorithm-explained-d1fef85f22c8

/*
* DESCRIPTION
  - A script that takes in data and returns clusters using affinity propogation clustering

* INPUTS
  input_data: {
    _ids: [
      An array of _ids taken in to assign users to clusters where each position corresponds to a row in the dataset
    ],
    dataset: [
      An imput matrix of data where each row represents one user and each comulm represents a data category for users
    ]
  }

* OUTPUTS
  clusters: [
    A list of all clusters found by the APClustering algorythm, where each cluster is a list of users in that cluster
  ]
*/

module.exports = function (input_data) {
  let dataset = input_data.dataset;
  let _ids = input_data._ids;

  let sim_matrix = [];

  // i -> Person A
  // j -> Person B
  // l -> Trait selector

  let lowest_num = 0;

  for (let i = 0; i < dataset.length; i++) {
    let row = [];
    for (let j = 0; j < dataset.length; j++) {
      let sum = 0;
      for (let l = 0; l < dataset[i].length; l++) {
        sum += Math.pow(dataset[i][l] - dataset[j][l], 2);
      }
      sum *= -1;
      if (lowest_num > sum) {
        lowest_num = sum;
      }
      row.push(sum);
    }
    sim_matrix.push(row);
  }

  // console.log(sim_matrix);

  for (let i = 0; i < sim_matrix.length; i++) {
    sim_matrix[i][i] = lowest_num;
  }

  // console.log(sim_matrix);

  let resp_matrix = [];

  for (let i = 0; i < sim_matrix.length; i++) {
    let row = [];
    for (let j = 0; j < sim_matrix[i].length; j++) {
      let resp = sim_matrix[i][j];
      let greatest;

      if (j == 0) {
        greatest = sim_matrix[i][1];
      } else {
        greatest = sim_matrix[i][0];
      }

      for (let l = 0; l < sim_matrix[i].length; l++) {
        if (l == j) {
          continue;
        }

        if (sim_matrix[i][l] > greatest) {
          greatest = sim_matrix[i][l];
        }
      }

      resp = resp - greatest;
      row.push(resp);
    }
    resp_matrix.push(row);
  }

  // console.log(resp_matrix);

  let avail_matrix_centers = [];

  for (let i = 0; i < resp_matrix.length; i++) {
    let sum = 0;
    for (let j = 0; j < resp_matrix.length; j++) {
      if (i == j) {
        continue;
      }

      if (resp_matrix[j][i] > 0) {
        sum += resp_matrix[j][i];
      }
    }
    avail_matrix_centers.push(sum);
  }

  // console.log(avail_matrix_centers);
  // console.log(resp_matrix);

  let avail_matrix = [];

  // i is running horizontally
  // j is running vertically

  for (let i = 0; i < resp_matrix[0].length; i++) {
    for (let j = 0; j < resp_matrix.length; j++) {
      if (i == 0) {
        avail_matrix.push([]);
      }
      if (i == j) {
        avail_matrix[i].push(avail_matrix_centers[i]);
      } else {
        let avail = resp_matrix[i][i];

        for (let l = 0; l < resp_matrix.length; l++) {
          if (l == j || l == i) {
            continue;
          } else if (resp_matrix[l][i] > 0) {
            avail += resp_matrix[l][i];
          }
        }
        avail_matrix[j].push(avail);
      }
    }
  }

  // console.log(avail_matrix);

  let crit_matrix = [];

  for (let i = 0; i < avail_matrix.length; i++) {
    let row = [];
    for (let j = 0; j < avail_matrix[i].length; j++) {
      row.push(resp_matrix[i][j] + avail_matrix[i][j]);
    }
    crit_matrix.push(row);
  }

  // console.log(crit_matrix);

  let clusters = [];

  for (let i = 0; i < crit_matrix[0].length; i++) {
    clusters.push([]);
  }

  for (let i = 0; i < crit_matrix.length; i++) {
    let highest = crit_matrix[i][0];
    let highest_index = 0;
    for (let j = 0; j < crit_matrix[i].length; j++) {
      if (crit_matrix[i][j] > highest) {
        highest = crit_matrix[i][j];
        highest_index = j;
      }
    }
    clusters[highest_index].push(_ids[i]);
  }

  for (let i = 0; i < clusters.length; i++) {
    if (clusters[i].length == 0) {
      clusters.splice(i, 1);
      i--;
    }
  }

  return clusters;
};

//* VERIFIED WORKING
