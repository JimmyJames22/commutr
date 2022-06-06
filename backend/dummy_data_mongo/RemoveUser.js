const mongo = require("mongodb");
const { MongoClient } = require("mongodb");
const mongo_uri =
  "mongodb+srv://gumba:COiUaIcaegjHWO41@cluster0.kiwky.mongodb.net/dummyData?retryWrites=true&w=majority";
const client = new MongoClient(mongo_uri);

let dest_data;

exports.deleteUser = async (req, res) => {
  const { user_id, isDriver } = req.body;
  const uid = mongo.ObjectID(user_id);
  let cursor = await client.db("dummyData").collection("users").find({
    _id: uid,
  });

  let user = await cursor.toArray();
  console.log("deleteUser");
  try {
    await client.connect();
    console.log("Mongo connected");

    await removeFromUsers(uid);
    await removeFromRoute(uid, isDriver, user);
    await removeFromUserMap(uid);
    console.log("user deleted");
  } catch (e) {
    console.error(e);
  } finally {
    client.close();
    res.end("user deleted");
  }
};

exports.removeUserFromRoute = async (req, res) => {
  console.log("removeUserFromRoute");
  let { user_id } = req.body;
  user_id = mongo.ObjectID(user_id);
  let cursor = await client.db("dummyData").collection("users").find({
    _id: user_id,
  });

  let user = await cursor.toArray();
  try {
    await client.connect();
    console.log("Mongo connected");

    await removeFromRoute(user_id, false, user);
    console.log("user removed from route");
  } catch (e) {
    console.error(e);
  } finally {
    client.close();
    res.end("user removed from route");
  }
};

async function removeFromRoute(user_id, isDriver) {
  if (isDriver) {
    let cursor = await client
      .db("dummyData")
      .collections("pairings")
      .deleteOne({
        driver_id: user_id,
      });

    let response = await cursor.toArray();
  } else {
    let cursor = await client.db("dummyData").collection("users").find({
      destination_id: user.destination_id,
    });

    let users = await cursor.toArray();

    cursor = await client
      .db("dummyData")
      .collection("destinations")
      .find({
        _id: ObjectID(user.destination_id),
      });

    dest_data = await cursor.toArray();

    //! VERIFIED WORKING
    cursor = await client
      .db("dummyData")
      .collection("pairings")
      .find({
        stops: {
          $all: [user_id],
        },
      });

    let route_obj = await cursor.toArray();
    route_obj = route_obj[0];
    console.log(route_obj);

    for (let i = 0; i < route_obj.stops.length; i++) {
      if (user_id.toString() == route_obj.stops[i].toString()) {
        console.log(i);
        route_obj.stops.splice(i, 1);
        break;
      }
    }

    let stops_by_user = [];
    for (let j = 0; j < users.length; j++) {
      for (let i = 0; i < route_obj.stops.length; i++) {
        if (users[j]._id.toString == route_obj.stops[i]._id.toString()) {
          stops_by_user.push(users[j]);
        }
      }
    }

    let route_lat_lng = [];
    for (let i = 0; i < stops_by_user.length; i++) {
      route_lat_lng.push([
        stops_by_user[i].lat_lng[0],
        stops_by_user[i].lat_lng[1],
      ]);
    }

    let route_polyline = await getRoutePolyline(
      stops_by_user[0],
      route_lat_lng
    );

    await client
      .db("dummyData")
      .collection("pairings")
      .updateOne(
        {
          _id: route_obj._id,
        },
        {
          $set: {
            driver_id: stops_by_user[0]._id,
            dest_id: dest_data._id,
            polyline: route_polyline,
            stops: route_obj.stops,
          },
        },
        {
          upsert: true,
        }
      );

    console.log(route_obj);
  }
}

async function removeFromUsers(user_id) {
  await client.db("dummyData").collection("users").deleteOne({
    _id: user_id,
  });
}

async function removeFromUserMap(user_id) {
  await client.db("dummyData").collection("userMap").deleteMany({
    u1: user_id.toString(),
  });

  await client.db("dummyData").collection("userMap").deleteMany({
    u2: user_id.toString(),
  });
}

async function getRoutePolyline(driver, route_lat_lng) {
  let waypoint_polyline = encode(route_lat_lng);
  if (route_lat_lng.length > 0) {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/directions/json?destination=place_id:${dest_data.place_id}&origin=place_id:${driver.place_id}&waypoints=enc:${waypoint_polyline}:&key=${API_KEY}`
    );
    console.log(
      `https://maps.googleapis.com/maps/api/directions/json?destination=place_id:${dest_data.place_id}&origin=place_id:${driver.place_id}&waypoints=enc:${waypoint_polyline}:&key=${API_KEY}`
    );
    try {
      return response.data.routes[0].overview_polyline.points;
    } catch (err) {
      return waypoint_polyline;
    }
  } else {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/directions/json?destination=place_id:${dest_data.place_id}&origin=place_id:${driver.place_id}&key=${API_KEY}`
    );
    console.log(
      `https://maps.googleapis.com/maps/api/directions/json?destination=place_id:${dest_data.place_id}&origin=place_id:${driver.place_id}&key=${API_KEY}`
    );
    try {
      return response.data.routes[0].overview_polyline.points;
    } catch (err) {
      console.log(err.message);
      return waypoint_polyline;
    }
  }
}
