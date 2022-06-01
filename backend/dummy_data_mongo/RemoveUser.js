const { ObjectID } = require("mongodb");
const { MongoClient } = require("mongodb");
const mongo_uri =
  "mongodb+srv://gumba:COiUaIcaegjHWO41@cluster0.kiwky.mongodb.net/dummyData?retryWrites=true&w=majority";
const client = new MongoClient(mongo_uri);

exports.deleteUser = async (req, res) => {
  console.log("deleteUser");
  let { user_id } = req.body;
  user_id = ObjectID(user_id);
  try {
    await client.connect();
    console.log("Mongo connected");

    await removeFromUsers(user);
    await removeFromRoute(user);
    await removeFromUserMap(user);
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
  user_id = ObjectID(user_id);
  try {
    await client.connect();
    console.log("Mongo connected");

    await removeFromRoute(user);
    console.log("user removed from route");
  } catch (e) {
    console.error(e);
  } finally {
    client.close();
    res.end("user removed from route");
  }
};

async function removeFromRoute(user) {
  //! VERIFIED WORKING
  let cursor = await client
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

  await client
    .db("dummyData")
    .collection("pairings")
    .updateOne(
      {
        _id: route_obj._id,
      },
      {
        $set: {
          stops: route_obj.stops,
        },
      },
      {
        upsert: true,
      }
    );

  console.log(route_obj);

  client.close();
}

async function removeFromUsers(user) {
  await client.db("dummyData").collection("users").deleteOne({
    _id: user_id,
  });
}

async function removeFromUserMap(user) {
  await client.db("dummyData").collection("userMap").deleteMany({
    u1: user_id.toString(),
  });

  await client.db("dummyData").collection("userMap").deleteMany({
    u2: user_id.toString(),
  });
}
