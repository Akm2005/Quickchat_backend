const express = require("express");
const { register, login, getUserByToken,allUsers,getUserById } = require("../../controllers/auth/authcontroller");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/userbytoken",getUserByToken);
router.get("/users",allUsers);
router.get("/user/:id",getUserById);

module.exports = router;
 