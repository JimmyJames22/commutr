const Time = require("./Time.js");
const { calcEfficiency } = require("./CalcEfficiency");

class User {
  constructor(user) {
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.place_id = user.place_id;
    this.lng = user.lng;
    this.lat = user.lat;
    this.address = user.address;
    this.dest_place_id = user.dest_place_id;
    this.dest_lng = user.dest_lng;
    this.dest_lat = user.dest_lat;
    this.dest_address = user.dest_address;
    this.is_driver = user.is_driver;
    this.class_year = user.class_year;
    this.email = user.email;
    this.phone = user.phone;
    this.uid = user.uid;
    this.to_school = 0;

    this.arrival_times = user.arrival_times;
    this.departure_times = user.departure_times;

    if (this.is_driver) {
      this.max_stops = user.car_capacity;
      this.max_dur;
      this.driver_stop_object = {};
      this.best_route = {};
      this.best_route.efficiency;
      this.new_route = {};
      this.possible_stops = [];
      this.possible_route_stops = [];
    }
  }

  makeFirstRoute() {
    this.driver_stop_object = {
      firstname: this.firstname,
      lastname: this.lastname,
      place_id: this.place_id,
      lng: this.lng,
      lat: this.lat,
      address: this.address,
      class_year: this.class_year,
      email: this.email,
      phone: this.phone,
      uid: this.uid,
      is_driver: true,
      to_school: this.to_school,
      arrival_times: this.arrival_times,
      departure_times: this.departure_times,
    };
    this.best_route = {
      stops: [this.driver_stop_object],
      stops_by_uid: [this.uid],
      total_dur: this.to_school,
    };
    this.best_route.efficiency = calcEfficiency(
      this.max_dur - this.best_route.total_dur,
      this.best_route.stops
    );
  }

  durationToUid(uid, userMap) {
    // calls from userMap
    let map;
    for (let k = 0; k < userMap.length; k++) {
      map = userMap[k];
      if (map.u1 == this.uid && map.u2 == uid) {
        return map.dur;
      } else if (map.u1 == uid && map.u2 == this.uid) {
        return map.dur;
      }
    }
    return 0;
  }
}

module.exports = User;

/*
constructor(user, route_time_tolerance) {
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.place_id = user.place_id;
    this.lng = user.lng;
    this.lat = user.lat;
    this.dest_place_id = user.dest_place_id;
    this.dest_lng = user.dest_lng;
    this.dest_lat = user.dest_lat;
    this.is_driver = user.is_driver;
    this.class_year = user.class_year;
    this.email = user.email;
    this.phone = user.phone;
    this.uid = user.uid;
    this.to_school;

    this.arrival_times = user.arrival_times;
    this.departure_times = user.departure_times;

    if (this.is_driver) {
      this.max_stops = user.car_capacity;
      this.max_dist = this.to_school * route_time_tolerance;
      this.driver_stop_object = {
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
        arrival_times: this.arrival_times,
        departure_times: this.departure_times,
      };
      this.best_route = {
        stops: [this.driver_stop_object],
        stops_by_uid: [this.uid],
        total_dist: this.to_school,
      };
      this.best_route.efficiency = calcEfficiency(
        this.max_dist - this.best_route.total_dist,
        this.best_route.stops
      );
      this.new_route = {};
      this.possible_stops = [];
      this.possible_route_stops = [];
    }
  }
*/
