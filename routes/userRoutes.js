const express = require("express");
const userControl = require("../controls/userControl");
const authHandler = require("../handlers/authHandling");
const router = express.Router();

//TODO: Dont forget to add the authentication middleware
router.get("/", userControl.getAllUsers);
router.post("/login", userControl.login);
router.post("/", userControl.registerUser);

module.exports = router;
