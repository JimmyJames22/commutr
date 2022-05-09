const User = require('../models/user');
const {OAuth2Client} = require('google-auth-library');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const e = require('express');

const client = new OAuth2Client("277843423406-m30j9jo3krghef8dfae3uvfp3ujk10as.apps.googleusercontent.com")

exports.signup = (req, res) => {
    console.log(req.body);
    const { name, email, password } = req.body;
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
    const {tokenId, nameFirst, nameLast, address, phone, isDriver, carCapacity} = req.body;
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
                        const {_id, name, email, nameFirst, nameLast,phone,address,isDriver,ridesGiven, ridesTaken, carCapacity} = user;
                        res.json({
                            token,
                            user: {_id, name, email, nameFirst, nameLast,phone,address,isDriver, ridesGiven, ridesTaken, carCapacity}
                        })
                    } else {
                        let ridesGiven = 0;
                        let ridesTaken = 0;
                        let carCap = parseInt(carCapacity)
                        let password = email+process.env.JWT_SIGNIN_KEY
                        let newUser = new User({nameFirst, nameLast, email, password, phone, address, isDriver, carCapacity:carCap, ridesGiven, ridesTaken});
                        console.log(nameFirst, nameLast, email, password, phone, address, isDriver, carCap, ridesGiven, ridesTaken)
                        newUser.save((err, data) => {
                            if(err){
                                return res.status(400).json({
                                    error: "Something went wrong during signup", newUser
                                })
                            }

                            const token = jwt.sign({_id:data._id}, process.env.JWT_SIGNIN_KEY, {expiresIn: '7d'});
                            const {_id, nameFirst,nameLast, email, password, phone, address, isDriver, carCapacity, ridesGiven, ridesTaken} = newUser;
    
                            res.json({
                                token,
                                user: {_id, nameFirst, nameLast, email, password, phone, address, isDriver, carCapacity, ridesGiven, ridesTaken}
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