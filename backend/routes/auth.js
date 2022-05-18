const express = require("express");
const router = express.Router();

const {signup, googlelogin} = require("../controllers/auth");

const { findRoute, deletePassenger, changeInfo } = require("../controllers/queries")


router.post('/signup', signup);

router.post('/googlelogin', googlelogin);

router.post('/findroute', findRoute)

router.post('/deletepassenger', deletePassenger)

router.post('/changeinfo', changeInfo)



module.exports = router;

