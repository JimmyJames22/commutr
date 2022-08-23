const fs = require("fs");

let dests = [];
let users = [];

const center_lat = -71.06995481869149;
const center_lng = 42.257227602977615;
const max_dist = 1;
const min_dist = 0.05;

const num_dests = 5;
const num_users = 100;
const max__id = 10000;
let used__ids = [];

// CALLING ORDER
makeData();
saveData();

function makeData() {
  for (let i = 0; i < num_dests; i++) {
    let r = Math.random() * (max_dist - min_dist) + min_dist;
    let theta = Math.random() * 360;
    lat_delta = Math.sin(theta) * r;
    lng_delta = Math.cos(theta) * r;
    dests.push({
      _id: make_id(),
      lat: center_lat + lat_delta,
      lng: center_lng + lng_delta,
    });
  }
  for (let i = 0; i < num_users; i++) {
    let r = Math.random() * (max_dist - min_dist) + min_dist;
    let theta = Math.random() * 360;
    lat_delta = Math.sin(theta) * r;
    lng_delta = Math.cos(theta) * r;
    users.push({
      _id: make_id(),
      lat: center_lat + lat_delta,
      lng: center_lng + lng_delta,
    });
  }
}

function make_id() {
  let _id;
  let _id_found;
  let _id_good = false;

  while (!_id_good) {
    _id = Math.floor(Math.random() * max__id);
    _id_found = false;
    for (used__id in used__ids) {
      if (_id == used__id) {
        _id_found = true;
        break;
      }
    }
    if (!_id_found) {
      _id_good = true;
      used__ids.push(_id);
    }
  }

  return _id;
}

function saveData() {
  const users_js = "const user_list = " + JSON.stringify(users) + ";";
  const dests_js = "const dest_list = " + JSON.stringify(dests) + ";";
  fs.writeFile("./ref/users.json", JSON.stringify(users), () => {
    console.log("user json exported");
  });
  fs.writeFile("./ref/users.js", users_js, () => {
    console.log("user js exported");
  });
  fs.writeFile("./ref/dests.json", JSON.stringify(dests), () => {
    console.log("dest json exported");
  });
  fs.writeFile("./ref/dests.js", dests_js, () => {
    console.log("dest js exported");
  });
}
