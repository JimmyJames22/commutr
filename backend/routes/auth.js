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

const {
  deleteUser,
  removeUserFromRoute,
} = require("../dummy_data_mongo/RemoveUser");

const { initRoutes } = require("../dummy_data_mongo/InitRoutes");

router.post("/signup", signup);

router.post("/googlelogin", googlelogin);

router.post("/findroute", findRoute);

router.post("/deletepassenger", deletePassenger);

router.post("/changeinfo", changeInfo);

router.get("/dummyinput", makeUsers);

router.post("/adduser", addUser);

router.post("/deleteuser", deleteUser); // done

router.post("/removeuserfromroute", removeUserFromRoute); // done

router.post("/initroutes", initRoutes); // done

module.exports = router;
