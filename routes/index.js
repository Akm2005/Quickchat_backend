const express = require("express");
const authroute = require('./authroute/authroute');
const uploadroute = require('./mediauploadroute/index');
const router = express.Router();

router.use("/",authroute);
router.use("/media",uploadroute);

module.exports = router;
