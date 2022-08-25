const fs = require("fs");
const users = require("./ref/users.json");
const dests = require("./ref/dests.json");
const user_map = require("./ref/userMap.json");
const User = require("./supporters/User");
let APCluster = require("./APCluster.js");

let user_list = [];
let _id_list = [];

for (let i = 0; i < users.length; i++) {
  let row = [];
  let user_obj = {
    _id: users[i]._id,
    lng: users[i].lng,
    lat: users[i].lat,
  };
  _id_list.push(users[i]._id);
  user_list.push(new User(user_obj));
}

console.log("USERLIST");
console.log(user_list);
console.log(user_map);

let distance_matrix = [];

for (let i = 0; i < user_list.length; i++) {
  let row = [];
  for (let j = 0; j < user_list.length; j++) {
    row.push(user_list[i].durationTo_id(user_list[j]._id, user_map));
  }
  distance_matrix.push(row);
}

console.log(distance_matrix);

let input_data = {
  _ids: _id_list,
  dataset: distance_matrix,
};

const clusters = APCluster(input_data);

console.log("CLUSTERS!!!!!!!!!!!!!!!!!");
console.log(clusters);

for (let i = 0; i < users.length; i++) {
  let index;
  let cluster_found = false;
  for (let j = 0; j < clusters.length; j++) {
    for (let l = 0; l < clusters[j].length; l++) {
      if (users[i]._id == clusters[j][l]) {
        index = j;
        cluster_found = true;
        break;
      }
    }
    if (cluster_found) {
      break;
    }
  }
  users[i].cluster = index;
}

const users_js = "const user_list = " + JSON.stringify(users) + ";";
fs.writeFile("./ref/users.json", JSON.stringify(users), () => {
  console.log("user json exported");
});
fs.writeFile("./ref/users.js", users_js, () => {
  console.log("user js exported");
});
