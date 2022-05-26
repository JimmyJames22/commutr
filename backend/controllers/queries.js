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

async function routePush(route, destination, stops, dest){
    for (const id of stops){  //Go back and get names from IDS
        console.log("id:",id)
        await db.collection("users").find({"_id": id}).toArray().then(doc => {
            console.log({nameFirst:doc[0]["nameFirst"],nameLast:doc[0]["nameLast"],address:doc[0]["address"]})
            route.push({id:doc[0]["_id"],nameFirst:doc[0]["nameFirst"],nameLast:doc[0]["nameLast"],address:doc[0]["address"],lat_lng:doc[0]["lat_lng"],place_id:doc[0]["place_id"],isDriver:doc[0]["isDriver"]})
        })
        await db.collection("destinations").find({"_id": dest}).toArray().then(doc => {
            console.log({name:doc[0]["name"],address:doc[0]["address"],lat_lng:doc[0]["lat_lng"]})
            destination.push({id:doc[0]["_id"],name:doc[0]["name"],address:doc[0]["address"],lat_lng:doc[0]["lat_lng"], place_id:doc[0]["place_id"]})
        })
    }
    return await [route,destination]
}

exports.findRoute = (req, res) => {
    const {_id} = req.body;
    console.log("id: ", _id);
    var o_id = mongo.ObjectId(_id);
    console.log(o_id)
    db.collection("pairings").find({stops: {$in: [o_id]}}).toArray().then(response => {
        let route = []
        let destination = []
        let stops = response[0]["stops"]
        let routeid = response[0]["_id"]
        let dest = response[0]["stops"][response[0]["stops"].length-1]
        stops.pop();
        routePush(route, destination, stops, dest).then(route => {
            console.log("routes:", route[0], "dest:", route[1])
            res.json({
                routes: route[0],
                dest: route[1],
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