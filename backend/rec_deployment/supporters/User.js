/** @format */

const { ObjectId } = require("mongodb");

class User {
  constructor(user) {
    this._id = user._id;
    // this.place_id = user.place_id;
    this.lng = user.lng;
    this.lat = user.lat;
    // this.is_driver = user.is_driver;
    // this.to_school = user.to_school;

    // this.arrival_times = user.arrival_times;
    // this.departure_times = user.departure_times;
  }

  // makeFirstRoute() {
  //   this.driver_stop_object = {
  //     place_id: this.place_id,
  //     lng: this.lng,
  //     lat: this.lat,
  //     _id: this._id,
  //     is_driver: true,
  //     to_school: this.to_school,
  //     arrival_times: this.arrival_times,
  //     departure_times: this.departure_times,
  //   };
  //   this.best_route = {
  //     stops: [this.driver_stop_object],
  //     stops_by__id: [this._id],
  //     total_dur: this.to_school,
  //   };
  //   this.best_route.efficiency = calcEfficiency(
  //     this.max_dur - this.best_route.total_dur,
  //     this.best_route.stops
  //   );

  //   return this.best_route.efficiency;
  // }

  durationTo_id(_id, userMap) {
    //  calls from userMap
    if (this._id == _id) {
      return 0;
    }
    let map;
    for (let k = 0; k < userMap.length; k++) {
      map = userMap[k];
      if (map.u1 == this._id && map.u2 == _id) {
        return map.dist;
      } else if (map.u1 == _id && map.u2 == this._id) {
        return map.dist;
      }
    }
    return NaN;

    // return new Promise(async (resolve, reject) => {
    //   let cursor = await client.db("dummyData").collection("userMap").find({
    //     u1: this._id,
    //     u2: _id,
    //   });

    //   let results = await cursor.toArray();

    //   if (results.length == 0) {
    //     let cursor_2 = await client.db("dummyData").collection("userMap").find({
    //       u1: _id,
    //       u2: this._id,
    //     });

    //     let results_2 = await cursor_2.toArray();

    //     if (results_2.length == 0) {
    //       resolve(NaN);
    //     } else {
    //       resolve(results_2[0].dur);
    //     }
    //   } else {
    //     resolve(results[0].dur);
    //   }
    // })
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
    this._id = user._id;
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
        _id: this._id,
        is_driver: true,
        to_school: this.to_school,
        arrival_times: this.arrival_times,
        departure_times: this.departure_times,
      };
      this.best_route = {
        stops: [this.driver_stop_object],
        stops_by__id: [this._id],
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
