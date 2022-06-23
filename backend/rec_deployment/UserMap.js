const fs = require("fs");
const users = require("./ref/users.json");
const dests = require("./ref/dests.json");

const all_points = users.concat(dests);

let user_map = [];

// CALLING ORDER
makeUserMap();
exportUserMap();

function makeUserMap() {
  for (let i = 0; i < all_points.length; i++) {
    for (let j = i + 1; j < all_points.length; j++) {
      let u1 = all_points[i];
      let u2 = all_points[j];

      user_map.push({
        u1: u1._id,
        u2: u2._id,
        dist: Math.sqrt(
          Math.pow(u1.lat - u2.lat, 2) + Math.pow(u1.lng - u2.lng, 2)
        ),
      });
    }
  }
}

function exportUserMap() {
  fs.writeFile("./ref/userMap.json", JSON.stringify(user_map), () => {
    console.log("usermap exported");
  });
}
