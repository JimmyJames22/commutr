const express = require("express");
const router = express.Router();

const {signup, googlelogin} = require("../controllers/auth");

const { findRoute, deletePassenger, changeInfo, getDrivers, adminSignup } = require("../controllers/queries")

const { makeUsers } = require("../dummy_data_mongo/DataMaker")

router.post('/signup', signup);

router.post('/googlelogin', googlelogin);

router.post('/findroute', findRoute)

router.post('/deletepassenger', deletePassenger)

router.post('/changeinfo', changeInfo)

router.get('/getdrivers', getDrivers)

router.get('/dummyinput', makeUsers)

router.post('/googleloginadmin', adminSignup)

module.exports = router;

