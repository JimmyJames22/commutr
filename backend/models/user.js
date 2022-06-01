const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
    destination_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    phone: {
        type: String,
        trim: true,
        required: true,
        max: 16
    },
    arrivalTimes: {
        type: Array,
        trim: false,
        required: true,
    },
    departureTimes: {
        type: Array,
        trim: false,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    place_id: {
        type: String,
        required: true
    },
    lat_lng: {
        type: Array,
        required: true
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