/** @format */

const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectID;
const { encode } = require("@googlemaps/polyline-codec");
const axios = require("axios");
const { ObjectID } = require("mongodb");

const API_KEY = "AIzaSyCiN6uQWhP-Di1Lnwn63aw8tQJKUD-amPA";
const mongo_uri =
  "mongodb+srv://gumba:COiUaIcaegjHWO41@cluster0.kiwky.mongodb.net/dummyData?retryWrites=true&w=majority";
const client = new MongoClient(mongo_uri);

let users = [];
let userMap = [];

let init_promises = [];
let store_promises = [];

let dest_data;

let route_time_tolerance = 1.15;

// ! CODE CURRENTLY WORKS BUT IT'S VERY JANKED -- USERMAP IS FORMED AND INIT_PROMISES FINISHED BEFORE TO_SCHOOLS ARE UPDATED

exports.userMap = async (dest_id, dest_place_id) => {
  dest_data = {
    _id: dest_id,
    place_id: dest_place_id,
  };
  try {
    await client.connect();
    console.log("Mongo connected");
    let cursor = await client.db("dummyData").collection("users").find({
      destination_id: dest_data._id,
    });

    let results = await cursor.toArray();

    results.forEach((result, i) => {
      users.push({
        _id: result._id.toString(),
        place_id: result.place_id,
        lng: result.lat_lng[1],
        lat: result.lat_lng[0],
        is_driver: result.isDriver,
      });
    });

    console.log(users);
    await processDistances();
  } catch (e) {
    console.error(e);
  }
};

async function processDistances() {
  // this method creates the sequenced gmaps distance matrix api requests
  // they have to be sequenced because gmaps limits them based on the calculations and it throws errors otherwise
  // init local variables

  // variables updated each itteration
  let dest_coords = [];
  let dest__ids = [];
  let dest_counter = 0;
  let current_rate = [];
  let num_requests = 0;
  let current_user_coords = [];
  let current_user__ids = [];

  // list to store all vars
  let reqs_by_rate = [];
  let all_user_coords = [];

  // loop through all users to all other users and append those requests to current_rate
  for (let k = 0; k < users.length; k++) {
    console.log(users[k]._id);
    for (let l = k + 1; l < users.length; l++) {
      console.log(l);
      if (dest_counter >= 25) {
        // check if over the limit for the current rate
        // append current rate to reqs_by_rate
        current_rate.push({
          orig_param: "place_id:" + users[k].place_id,
          dest_param: "enc:" + encode(dest_coords) + ":",
          orig__id: users[k]._id,
          dest__ids: dest__ids.slice(0),
        });

        // increase the number of requests
        num_requests++;

        // reset all per-rate variables
        reqs_by_rate.push(current_rate.slice(0));
        dest_coords = [];
        dest__ids = [];
        current_rate = [];
        dest_counter = 0;
      }

      // update all per-rate variables
      dest_coords.push([users[l].lat, users[l].lng]);
      dest__ids.push(users[l]._id);
      dest_counter++;
    }

    // check for any unadded requests for the specified top-level user
    if (dest_coords.length > 0) {
      // add them to current_rate if necessary
      current_rate.push({
        orig_param: "place_id:" + users[k].place_id,
        dest_param: "enc:" + encode(dest_coords) + ":",
        orig__id: users[k]._id,
        dest__ids: dest__ids.slice(0),
      });
      dest_coords = [];
      dest__ids = [];

      num_requests++;
    }

    // END OF THE CODE FOR THE USERMAPS -- FOLLOWING CODE FOR USER.TO_SCHOOL

    // check if the length of current_user_coords exceeds the max of the dist matrix api
    if (current_user_coords.length < 25) {
      // if within the bounds, update current_user_coords and current_user__ids
      current_user_coords.push([users[k].lat, users[k].lng]);
      current_user__ids.push(users[k]._id);
    } else {
      // if not update all_user_coords and reset current_user variables
      all_user_coords.push({
        _ids: current_user__ids.slice(0),
        polyline: encode(current_user_coords),
      });
      current_user_coords = [[users[k].lat, users[k].lng]];
      current_user__ids = [users[k]._id];
    }
  }

  // update final reqs_by_rate
  reqs_by_rate.push(current_rate.slice(0));

  // update final all_user_coords
  all_user_coords.push({
    _ids: current_user__ids.slice(0),
    polyline: encode(current_user_coords),
  });

  // make all the gmaps api requests and process incoming data
  await makeUserMapReq(reqs_by_rate, all_user_coords);
}

async function makeUserMapReq(reqs_by_rate, all_user_coords) {
  // loop through all the possible requests separated by rate
  for (let i = 0; i < reqs_by_rate.length; i++) {
    for (let j = 0; j < reqs_by_rate[i].length; j++) {
      // make dist matrix api request and add the request promise to init_promises
      init_promises.push(
        axios
          // get gmaps data
          .get(
            `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${reqs_by_rate[i][j].orig_param}&destinations=${reqs_by_rate[i][j].dest_param}&key=${API_KEY}`
          )
          .then((response) => {
            console.log(
              `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${reqs_by_rate[i][j].orig_param}&destinations=${reqs_by_rate[i][j].dest_param}&key=${API_KEY}`
            );
            // init environment vars
            let dur;

            // loop through results
            for (let l = 0; l < response.data.rows[0].elements.length; l++) {
              // try reading duration data
              try {
                dur = response.data.rows[0].elements[l].duration.value;
              } catch (err) {
                console.log(err.message);
                dur = -1;
              }

              // update userMap with new data and the two correct _ids
              userMap.push({
                u1: reqs_by_rate[i][j].orig__id,
                u2: reqs_by_rate[i][j].dest__ids[l],
                dur: dur,
                dest: ObjectID(dest_data._id),
              });
            }
          })
          // catch any errors
          .catch(function (error) {
            console.log(error);
          })
      );
    }
    // sleep to avoid getting rate limited
    await sleep(5000);
    // log rough percent of requests made -- DEV TOOL SHOULD BE REMOVED
    console.log((i / (reqs_by_rate.length - 1)) * 100);
  }

  // loop through user.to_school requests
  for (let i = 0; i < all_user_coords.length; i++) {
    // make user.to_school dist matrix api requests
    init_promises.push(
      axios
        // get gmaps data
        .get(
          `https://maps.googleapis.com/maps/api/distancematrix/json?origins=place_id:${dest_data.place_id}&destinations=enc:${all_user_coords[i].polyline}:&key=${API_KEY}`
        )
        .then((response) => {
          console.log("TOSCHOOL");
          // init environment vars
          let user;

          // loop through all users in the response
          for (let l = 0; l < response.data.rows[0].elements.length; l++) {
            // store user var
            for (let maybe_user of users) {
              if (maybe_user._id == all_user_coords[i]._ids[l]) {
                user = maybe_user;
              }
            }

            let dur;
            // try to update user.to_school
            try {
              dur = response.data.rows[0].elements[l].duration.value;
            } catch (err) {
              console.log(err.message);
              dur = -1;
            }

            updateUserDur(user, dur);

            // check if user is driver
            if (user.is_driver == true) {
              let max_dur;
              // if so update max_dur
              if (dur == -1) {
                max_dur = -1;
              } else {
                max_dur = dur * route_time_tolerance;
              }

              updateUserMaxDur(user, max_dur);
            }
          }
        })
        // catch any errors
        .catch(function (error) {
          console.log(error);
        })
    );
    // sleep to avoid getting rate limited
    await sleep(5000);
    // log rough percent of requests made -- DEV TOOL SHOULD BE REMOVED
    console.log((i / (all_user_coords.length - 1)) * 100);
  }
  await saveUsermap();
}

function updateUserDur(user, dur) {
  init_promises.push(
    client
      .db("dummyData")
      .collection("users")
      .updateOne(
        {
          _id: ObjectId(user._id),
        },
        {
          $set: {
            to_school: dur,
          },
        },
        false,
        true
      )
  );
}

function updateUserMaxDur(user, max_dur) {
  init_promises.push(
    client
      .db("dummyData")
      .collection("users")
      .updateOne(
        {
          _id: ObjectId(user._id),
        },
        {
          $set: {
            max_dur: max_dur,
          },
        },
        false,
        true
      )
  );
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function saveUsermap() {
  Promise.all(init_promises).then(async () => {
    console.log(userMap);
    console.log("USERMAP");
    try {
      await writeUserMap(client);
    } catch (e) {
      console.error(e);
    } finally {
      await client.close();
    }
  });
}

async function writeUserMap(client) {
  for await (const userMapEntry of userMap) {
    const result = await client
      .db("dummyData")
      .collection("userMap")
      .updateOne(
        {
          u1: userMapEntry.u1,
          u2: userMapEntry.u2,
        },
        {
          $set: {
            u1: userMapEntry.u1,
            u2: userMapEntry.u2,
            dur: userMapEntry.dur,
            dest: userMapEntry.dest,
          },
        },
        {
          upsert: true,
        }
      );
  }
  console.log("DONE UPDATING");
}
