const express = require("express");
const router = express.Router();

const {
	multipleLogin,
	forgotPassword,
	postOTP,
} = require("../controller/loginController");

router.post("/login", multipleLogin);
router.post("/forgotPassword", forgotPassword);
router.post("/postOTP", postOTP);

module.exports = router;
