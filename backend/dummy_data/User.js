const Time = require("./Time.js");
const RouteFinder2 = require("./RouteFinder2.js");

class User {
  constructor(user, route_dist_tolerance) {
    this.x = user.x;
    this.y = user.y;
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.class_year = user.class_year;
    this.email = user.email;
    this.phone = user.phone;
    this.uid = user.uid;
    this.is_driver = user.is_driver;
    this.to_school = Math.sqrt(
      Math.pow(this.x - user.dest_x, 2) + Math.pow(this.y - user.dest_y, 2)
    );
    this.arrival_time = new Time(user.arrival_time);
    this.departure_time = new Time(user.departure_time);

    if (this.is_driver) {
      this.max_passengers = user.car_capacity;
      this.max_dist = this.to_school * route_dist_tolerance;
      this.route = {
        stops: [
          {
            x: this.x,
            y: this.y,
            firstname: this.firstname,
            lastname: this.lastname,
            class_year: this.class_year,
            email: this.email,
            phone: this.phone,
            uid: this.uid,
            is_driver: true,
            to_school: this.to_school,
            arrival_time: this.arrival_time,
            departure_time: this.departure_time,
          },
        ],
        total_dist: this.to_school,
        stops_by_id: [this.uid],
      };
      this.route.efficiency = RouteFinder2.calcEfficiency(
        this.route.total_dist,
        this.route.stops
      );
    }
  }

  distanceToUser(user) {
    // necessary to construct userMap
    return Math.sqrt(
      Math.pow(this.x - user.x, 2) + Math.pow(this.y - user.y, 2)
    );
  }

  distanceToUid(uid) {
    // calls from userMap
    let map;
    for (let k = 0; k < userMap.length; k++) {
      map = userMap[k];
      if (map.u1 == this.uid && map.u2 == uid) {
        return map.distance;
      } else if (map.u1 == uid && map.u2 == this.uid) {
        return map.distance;
      }
    }
    return 0;
  }
}

module.exports = User;
