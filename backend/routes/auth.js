const express = require("express");
const router = express.Router();

const {signup, googlelogin} = require("../controllers/auth");

const { findRoute, deletePassenger } = require("../controllers/queries")


router.post('/signup', signup);

router.post('/googlelogin', googlelogin);

router.post('/findroute', findRoute)

router.post('/deletepassenger', deletePassenger)



module.exports = router;

