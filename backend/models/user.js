const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    //nameFirst, nameLast, email, password, phone, address, isDriver, carCapacity, ridesGiven, ridesTaken
    nameFirst: {
        type: String,
        trim: true,
        required: true,
        max: 32
    }, 
    nameLast: {
        type: String,
        trim: true,
        required: true,
        max: 32
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        trim: true,
        required: true,
        max: 16
    },
    address: {
        type: String,
        required: true,
    },
    isDriver: {
        type: Boolean,
        required: true
    },
    carCapacity: {
        type: Number,
        required: true
    },
    ridesTaken: {
        type: Number,
        required: true
    },
    ridesGiven: {
        type: Number,
        required: true
    },

}, {timestamps: true})

module.exports = mongoose.model('User', userSchema);