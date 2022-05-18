const User = require('../models/user');
const {OAuth2Client} = require('google-auth-library');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const e = require('express');
const {MongoClient} = require('mongodb');
const mongo = require('mongodb')

const client = new MongoClient(process.env.ATLAS_URI);
async function main() {
	await client.connect();
}

main();
const db = client.db()

async function routePush(route, stops){
    for (const id of stops){  //Go back and get names from IDS
        console.log("id:",id)
        await db.collection("users").find({"_id": id}).toArray().then(doc => {
            console.log({nameFirst:doc[0]["nameFirst"],nameLast:doc[0]["nameLast"],address:doc[0]["address"]})
            route.push({id:doc[0]["_id"],nameFirst:doc[0]["nameFirst"],nameLast:doc[0]["nameLast"],address:doc[0]["address"],lng_lat:doc[0]["lng_lat"],place_id:doc[0]["place_id"],isDriver:doc[0]["isDriver"]})
        })
    }
    return await route
}

exports.findRoute = (req, res) => {
    const {_id} = req.body;
    console.log("id: ", _id);
    var o_id = mongo.ObjectId(_id);
    console.log(o_id)
    db.collection("pairings").find({stops: {$in: [o_id]}}).toArray().then(response => {
        let route = []
        let stops = response[0]["stops"]
        let routeid = response[0]["_id"]
        stops.pop();
        routePush(route, stops).then(route => {
            res.json({
                routes: route,
                id: routeid
            })
        })
    })
    
}

exports.deletePassenger = (req, res) => {
    const {r_id, u_id} = req.body;
    var route_id = mongo.ObjectId(r_id);
    var user_id = mongo.ObjectId(u_id);
    console.log("req-id:", route_id, "id:", user_id);
    db.collection("pairings").updateMany(
        {_id:route_id},
        {$pull: {'stops':{ $in: [ user_id ] }}}
    ).then(response => {
        res.json({
            result:"Deleted from route",
            resp:response,
        })
    })
}

exports.changeInfo = (req, res) => {
    const {id, loc, info} = req.body;
    var user_id = mongo.ObjectId(id);
    var query = {_id:user_id};
    var setParams = {}
    setParams[loc] = info;
    var setval = {$set: setParams};
    db.collection("users").updateOne(
        query,
        setval
    ).then(response => {
        res.json({
            result: setval,
            resp:response,
        })
    })
}