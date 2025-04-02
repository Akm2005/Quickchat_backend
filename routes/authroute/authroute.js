const express = require("express");
const { register, login, getUserByToken } = require("../../controllers/auth/authcontroller");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/userbytoken",getUserByToken);

module.exports = router;
 