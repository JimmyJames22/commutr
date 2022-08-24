let APCluster = require("../APCluster.js");

let input_data = {
  _ids: ["Alice", "Bob", "Cary", "Doug", "Edna"],
  dataset: [
    [3, 4, 3, 2, 1],
    [4, 3, 5, 1, 1],
    [3, 5, 3, 3, 3],
    [2, 1, 3, 3, 2],
    [1, 1, 3, 2, 3],
  ],
};

const back = APCluster(input_data);

console.log("BACK!!!!!!!!!!!!!!!!!");
console.log(back);
