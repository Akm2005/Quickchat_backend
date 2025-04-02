const express = require("express");
const authroute = require('./authroute/authroute');
const router = express.Router();

router.use("/",authroute);

module.exports = router;
