const User = require('../models/user');
const {OAuth2Client} = require('google-auth-library');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const e = require('express');
const mongo = require('mongodb');

const client = new OAuth2Client("277843423406-m30j9jo3krghef8dfae3uvfp3ujk10as.apps.googleusercontent.com")

exports.signup = (req, res) => {
    console.log(req.body);
    const { name, email} = req.body;
    User.findOne({email}).exec((err, user) => {
        if(user) {
            return res.status(400).json({error: "User with this email already exists."});
        }
        let newUser = new User({name, email, password});
        newUser.save((err, success) => {
            if(err) {
                console.log("Error in signup: ", err);
                return res.status(400), json({error: err})
            }
            res.json({
                message: "Signup success!"
            })
        })
    })
}

// tokenId: response.tokenId,
// nameFirst: details.firstname,
// nameLast: details.lastname,
// address: details.address,
// phone: details.phone,
// isDriver: details.status,
// carCapacity: details.carCapacity

exports.googlelogin = (req, res) => {
    const {tokenId, nameFirst, nameLast, address, destination_id, place_id, lat_lng, phone, arrivalTimes, departureTimes, isDriver, carCapacity} = req.body;
    console.log(tokenId);
    client.verifyIdToken({idToken: tokenId, audience: "277843423406-m30j9jo3krghef8dfae3uvfp3ujk10as.apps.googleusercontent.com"}).then(response => {
        const { email_verified, email } = response.payload;
        if(email_verified){
            User.findOne({email}).exec((err, user) =>{
                if(err){
                    return res.status(400).json({
                        error: "something went wrong..."
                    })
                } else {
                    if(user) {
                        const token = jwt.sign({_id:user._id}, process.env.JWT_SIGNIN_KEY, {expiresIn: '7d'});
                        const {_id, name, email, destination_id, nameFirst, nameLast,phone, arrivalTimes, departureTimes, address, place_id, lat_lng, isDriver,ridesGiven, ridesTaken, carCapacity} = user;
                        res.json({
                            token,
                            user: {_id, name, email, destination_id, nameFirst, nameLast,phone, arrivalTimes, departureTimes, address,place_id, lat_lng, isDriver, ridesGiven, ridesTaken, carCapacity}
                        })
                    } else {
                        let ridesGiven = 0;
                        let ridesTaken = 0;
                        let carCap = parseInt(carCapacity)
                        var destid = mongo.ObjectId(destination_id);
                   
                  

                        let newUser = new User({
                            nameFirst, 
                            nameLast, 
                            email,
                            destination_id: destid, 
                            phone,
                            arrivalTimes,
                            departureTimes,
                            address, 
                            place_id, 
                            lat_lng, 
                            isDriver, 
                            carCapacity:carCap, 
                            ridesGiven, 
                            ridesTaken
                        });
                        
                        console.log(nameFirst, nameLast, email, destination_id, phone, arrivalTimes, departureTimes, address, place_id, lat_lng, isDriver, carCap, ridesGiven, ridesTaken)
                        newUser.save((err, data) => {
                            if(err){
                                return res.status(400).json({
                                    error: "Something went wrong during signup", newUser
                                })
                            }

                            const token = jwt.sign({_id:data._id}, process.env.JWT_SIGNIN_KEY, {expiresIn: '7d'});
                            const {_id, nameFirst,nameLast, email, destination_id, phone, arrivalTimes, departureTimes, address, place_id, lat_lng, isDriver, carCapacity, ridesGiven, ridesTaken} = newUser;
    
                            res.json({
                                token,
                                user: {_id, nameFirst, nameLast, email, destination_id, phone, arrivalTimes, departureTimes, address, place_id, lat_lng, isDriver, carCapacity, ridesGiven, ridesTaken}
                            })

                        })
                    }
                }
            })
        }
        console.log(response.payload);
    })

    console.log()

}