const express = require("express");
const router = express.Router();

const { signup, googlelogin } = require("../controllers/auth");

const {
  findRoute,
  deletePassenger,
  changeInfo,
} = require("../controllers/queries");

const { makeUsers } = require("../dummy_data_mongo/DataMaker");

const { addUser } = require("../dummy_data_mongo/AddUser");

router.post("/signup", signup);

router.post("/googlelogin", googlelogin);

router.post("/findroute", findRoute);

router.post("/deletepassenger", deletePassenger);

router.post("/changeinfo", changeInfo);

router.get("/dummyinput", makeUsers);

router.post("/addpassenger", addUser);

module.exports = router;
