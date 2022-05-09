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
            route.push({nameFirst:doc[0]["nameFirst"],nameLast:doc[0]["nameLast"],address:doc[0]["address"]})
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
        stops.pop();
        routePush(route, stops).then(route => {
            res.json({
                routes: route
            })
        })
    })
    
}