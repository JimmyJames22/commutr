const express = require("express");
const router = express.Router();

const {signup, googlelogin} = require("../controllers/auth");

router.post('/signup', signup);

router.post('/googlelogin', googlelogin);

module.exports = router;

