const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectID;
const API_KEY = "AIzaSyCiN6uQWhP-Di1Lnwn63aw8tQJKUD-amPA";
const { encode } = require("@googlemaps/polyline-codec");
const { ObjectID } = require("mongodb");
const { calcEfficiency, sumEfficiency } = require("./supporters/CalcEfficiency");

const mongo_uri =
  "mongodb+srv://gumba:COiUaIcaegjHWO41@cluster0.kiwky.mongodb.net/dummyData?retryWrites=true&w=majority";
const client = new MongoClient(mongo_uri);

let existing_users = [];
let drivers = [];
let routes = [];

let dest_obj;

let route_dist_tolerance = 1.15;

let user_map_promises = [];

let user_map_updates = [];

let userMap = [];

exports.addUser = async (req, res) => {
  let { user } = req.body;
  user._id = ObjectID(user._id);
  try {
    await client.connect();
    console.log("Mongo connected");

    let cursor = await client.db("dummyData").collection("users").find({
      destination_id: user.destination_id,
    });
    existing_users = await cursor.toArray();

    for(let i=0; i<existing_users.length; i++){
      if(existing_users[i].isDriver == true){
        cursor = await client.db("dummyData").collection("pairings").find({
          driver_id: existing_users[i]._id,
        })

        routes = await cursor.toArray();

        if(routes[0].stops.length < existing_users[i].carCapacity){
          drivers.push({
            driver: existing_users[i],
            route: routes[0],
            newSumEff: -1,
          })
        }
      }
    }

    cursor = await client.db("dummyData").collection("destinations").find({
      _id: ObjectId(user.destination_id)
    })
    dest_obj = await cursor.toArray();
    dest_obj = dest_obj[0]

    cursor = await client.db("dummyData").collection("userMap").find({
      dest: ObjectID(user.destination_id)
    })
    userMap = await cursor.toArray();

    await updateUserMap(user);
    await Promise.all(user_map_promises).then( async () => {
      console.log(user_map_updates);
      // pushNewUserMap();

      let msg_back;
      if(user.isDriver){
        msg_back = await pushNewPairing()
      } else {
        msg_back = await assignRoute();
      }

      res.end(msg_back)
    })
  } catch (e) {
    console.error(e);
  } finally {
    client.close();
  }
};

async function updateUserMap(user) {
  let users_by_rate = [];
  let user_coords_by_rate = [];
  let user_coords_current_rate = [];
  let users_current_rate = [];
  let counter = 0;

  for (let i = 0; i < existing_users.length; i++) {
    user_coords_current_rate.push([existing_users.lat_lng[0], existing_users.lat_lng[1]])
    users_current_rate.push(existing_users._id.toString())
    counter ++;

    if(counter == 25){
      user_coords_by_rate.push(user_coords_current_rate)
      users_by_rate.push(users_current_rate)
      counter = 0;
    }
  }

  user_coords_by_rate.push(user_coords_current_rate)
  users_by_rate.push(users_current_rate)

  for(let i=0; i<user_coords_by_rate.length; i++){
    user_map_promises.push(
      axios.get(
        `https://maps.googleapis.com/maps/api/distancematrix/json?origins=place_id:${user.place_id}&destinations=enc:${encode(user_coords_by_rate[i])}:&key=${API_KEY}`
      )
      .then((response) => {
        console.log(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=place_id:${user.place_id}&destinations=enc:${encode(user_coords_by_rate[i])}:&key=${API_KEY}`)
        
        let dur;
        for (let l = 0; l < response.data.rows[0].elements.length; l++) {
          try {
            dur = response.data.rows[0].elements[l].duration.value;
          } catch (err) {
            console.log(err.message);
            dur = -1;
          }

          let new_entry = {
            u1: user._id.toString(),
            u2: users_by_rate[i][l]._id.toString(),
            dur: dur,
            dest: ObjectID(user.destination_id)
          }

          user_map_updates.push(new_entry);
          userMap.push(new_entry);
        }
      })
    )

    await sleep(5000)
  }

  user_map_promises.push(
    axios.get(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=place_id:${user.place_id}&destinations=place_id:${dest_obj.place_id}&key=${API_KEY}`
    )
    .then((response) => {
      let dur;
      try {
        dur = response.data.rows[0].elements[l].duration.value;
      } catch (err) {
        console.log(err.message);
        dur = -1;
      }

      updateUserDur(user, dur)
      user.to_school = dur;

      if(user.isDriver){
        if (dur == -1) {
          max_dur = -1;
        } else {
          max_dur = dur * route_time_tolerance;
        }

        updateUserMaxDur(user, max_dur)
        user.max_dur = max_dur;
      }
    })
  )
}


function updateUserDur(user, dur) {
  user_map_promises.push(
    client
      .db("dummyData")
      .collection("users")
      .updateOne(
        {
          _id: user._id,
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
  user_map_promises.push(
    client
      .db("dummyData")
      .collection("users")
      .updateOne(
        {
          _id: user._id,
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

async function pushNewUserMap(){
  for await (const userMapEntry of user_map_updates) {
    const result = await client
      .db("dummyData")
      .collection("userMap")
      .updateOne(
        {
          u1: userMapEntry.u1,
          u2: userMapEntry.u2,
          dur: userMapEntry.dur,
        },
        {
          $set: {
            u1: userMapEntry.u1,
            u2: userMapEntry.u2,
            dur: userMapEntry.dur,
          },
        },
        {
          upsert: true,
        }
      );
  }
  console.log("DONE UPDATING");
}

async function assignRoute(){
  let effArray = [];
  let driver_arr = [];
  for(let i=0; i<drivers.length; i++){
    let route = drivers[i].route;
    let driver = drivers[i].driver;
    route.total_dur = 0;
    route.stops_by_id = route.stops.slice(0);
    for(let j=0; j<route.stops.length; j++){
      for(let l=0; l<existing_users.length; l++){
        if(existing_users[l]._id.toString() == route.stops[j].toString()){
          route.stops[k] = existing_users[l];
        }
      }

      distanceTo(route.stops[j], route.stops[j-1])

      if(j>0){
        let dur;
        
        route.total_dur += dur;
      }
    }

    driver.new_route = route;

    drivers[i] = drivers[i].driver;
  }

  let best_eff = sumEfficiency(drivers);
  let best_index = -1;

  for(let i=0; i<drivers.length; i++){
    let driver_arr = drivers.slice(0);
    for(let j=0; j<driver_arr.length; j++){
      if(j==i){
        driver_arr[j].new_route.total_dur += distanceTo(user._id.toString(), driver_arr[j].new_route.stops[driver_arr[j].new_route.stops.length-1]._id.toString())
        driver_arr[j].new_route.total_dur += user.to_school;
        if(driver_arr[j].new_route.total_dur > driver.max_dur){
          drivers.splice(i, 1)
          break;
        }
        driver_arr[j].new_route.stops.push(user);
      } else {
        driver_arr[j].new_route.total_dur += driver_arr[j].new_route.stops[driver_arr[j].new_route.stops.length-1].to_school
      }

      if(j==driver_arr.length-1){
        effArray.push(sumEfficiency(driver_arr))
      }
    }
  }

  for(let i=0; i<effArray.length; i++){
    if(effArray[i] > best_eff){
      best_eff = effArray[i];
      best_index = i;
    }
  }

  if(best_index == -1){
    return "User could not be added to any route"
  } else {
    let driver = drivers[best_index];

    await client
    .db("dummyData")
    .collection("pairings")
    .updateOne(
      {
        driver_id:driver._id
      },
      {
        $set: {
          stops: driver.new_route.stops_by_id,
        },
      },
      {
        upsert: true,
      }
    );

    return "User added to driver with id: " + driver._id.toString() + " "
  }
}

async function pushNewPairing(){
  const result = await client
  .db("dummyData")
  .collection("pairings")
  .updateOne(
    {
      driver_id:user._id
    },
    {
      $set: {
        driver_id:user._id,
        stops: [user._id],
      },
    },
    {
      upsert: true,
    }
  );

  return "New pairing created"
}

function distanceTo(u1, u2){
  for(let l=0; l<userMap.length; l++){
    if(userMap[l].u1 == u1 && userMap.u2 == u2){
      return userMap[l].dur
    } else if (userMap[l].u2 == u1 && userMap.u1 == u2){
      return userMap[l].dur
    }
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}