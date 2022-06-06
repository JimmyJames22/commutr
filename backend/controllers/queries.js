/** @format */

const User = require("../models/user");
const { OAuth2Client } = require("google-auth-library");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const e = require("express");
const { MongoClient } = require("mongodb");
const mongo = require("mongodb");
const authclient = new OAuth2Client(
  "277843423406-m30j9jo3krghef8dfae3uvfp3ujk10as.apps.googleusercontent.com"
);

const client = new MongoClient(process.env.ATLAS_URI);
async function main() {
  await client.connect();
}

main();
const db = client.db();

async function routePush(route, destination, stops, dest) {
  if (stops.length > 0) {
    for (const id of stops) {
      //Go back and get names from IDS
      console.log("id:", id);
      await db
        .collection("users")
        .find({ _id: id })
        .toArray()
        .then((doc) => {
          console.log({
            nameFirst: doc[0]["nameFirst"],
            nameLast: doc[0]["nameLast"],
            address: doc[0]["address"],
          });
          route.push({
            id: doc[0]["_id"],
            nameFirst: doc[0]["nameFirst"],
            nameLast: doc[0]["nameLast"],
            address: doc[0]["address"],
            lat_lng: doc[0]["lat_lng"],
            place_id: doc[0]["place_id"],
            phoneNumber: doc[0]["phone"],
            isDriver: doc[0]["isDriver"],
          });
        });
    }
  }

  await db
    .collection("destinations")
    .find({ _id: dest })
    .toArray()
    .then((doc) => {
      console.log({
        name: doc[0]["name"],
        address: doc[0]["address"],
        lat_lng: doc[0]["lat_lng"],
      });
      destination.push({
        id: doc[0]["_id"],
        name: doc[0]["name"],
        address: doc[0]["address"],
        lat_lng: doc[0]["lat_lng"],
        place_id: doc[0]["place_id"],
        paired: doc[0]["pairingsRun"],
      });
    });
  return await [route, destination];
}

exports.findRoute = (req, res) => {
  const { _id, destination_id } = req.body;
  console.log("");
  console.log("id: ", _id, "dest:", destination_id);
  var o_id = mongo.ObjectId(_id);
  console.log(o_id);
  db.collection("pairings")
    .find({ stops: { $in: [o_id] } })
    .toArray()
    .then((response) => {
      let route = [];
      let destination = [];
      let stops = [];
      let routeid = [];
      let polyline;
      if (response.length > 0) {
        stops = response[0]["stops"];
        routeid = response[0]["_id"];
        polyline = response[0]["polyline"];
        stops.pop();
      }
      let dest = mongo.ObjectId(destination_id);
      routePush(route, destination, stops, dest).then((route) => {
        console.log("routes:", route[0], "dest:", route[1]);
        res.json({
          routes: route[0],
          dest: route[1],
          polyline: polyline,
          id: routeid,
        });
      });
    });
};

exports.deletePassenger = (req, res) => {
  const { r_id, u_id } = req.body;
  var route_id = mongo.ObjectId(r_id);
  var user_id = mongo.ObjectId(u_id);
  console.log("req-id:", route_id, "id:", user_id);
  db.collection("pairings")
    .updateMany({ _id: route_id }, { $pull: { stops: { $in: [user_id] } } })
    .then((response) => {
      res.json({
        result: "Deleted from route",
        resp: response,
      });
    });
};

exports.changeInfo = (req, res) => {
  const { id, loc, info } = req.body;
  var user_id = mongo.ObjectId(id);
  var query = { _id: user_id };
  var setParams = {};
  setParams[loc] = info;
  var setval = { $set: setParams };
  db.collection("users")
    .updateOne(query, setval)
    .then((response) => {
      res.json({
        result: setval,
        resp: response,
      });
    });
};

exports.changeSchedule = (req, res) => {
  const { id, info } = req.body;
  var arrivals = info[0];
  var departures = info[1];
  var user_id = mongo.ObjectId(id);
  var query = { _id: user_id };
  db.collection("users")
    .updateMany(query, {
      $set: { arrivalTimes: { arrivals }, departureTimes: { departures } },
    })
    .then((response) => {
      res.json({
        result: response,
      });
    });
};

exports.getDrivers = (req, res) => {
  db.collection("users")
    .find({ isDriver: true })
    .sort({ ridesGiven: -1 })
    .toArray()
    .then((response) => {
      var driverList = [];
      for (var i = 0; i < response.length; i++) {
        let name = response[i].nameFirst + " " + response[i].nameLast;
        let ridesGiven = response[i].ridesGiven;
        let email = response[i].email;
        driverList.push({ name: name, ridesGiven: ridesGiven, email: email });
      }

      res.json({
        drivers: driverList,
      });
    });
};

exports.adminSignup = (req, res) => {
  const { tokenId } = req.body;
  console.log(tokenId);
  authclient
    .verifyIdToken({
      idToken: tokenId,
      audience:
        "277843423406-m30j9jo3krghef8dfae3uvfp3ujk10as.apps.googleusercontent.com",
    })
    .then((response) => {
      const { email_verified, email } = response.payload;
      if (email_verified) {
        db.collection("admins")
          .findOne({ email })
          .then((user) => {
            if (user) {
              const token = jwt.sign(
                { _id: user._id },
                process.env.JWT_SIGNIN_KEY,
                { expiresIn: "7d" }
              );
              //what to get under here
              const {
                _id,
                nameFirst,
                nameLast,
                email,
                phone,
                org_id,
                hasPaired,
                org_name,
                org_place_id,
              } = user;
              res.json({
                token,
                user: {
                  _id,
                  nameFirst,
                  nameLast,
                  email,
                  phone,
                  org_id,
                  hasPaired,
                  org_name,
                  org_place_id,
                },
              });
            } else {
              res.json({
                token,
                user: "NA",
              });
            }
          });
      }
      console.log(response.payload);
    });
};

//
