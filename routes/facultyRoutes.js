const express = require("express");
const passport = require("passport");
const upload = require("../utils/multer");

const router = express.Router();

const {
	markAttendence,
	getAllSubjects,
	updatePassword,
	updateImage,
	updateProfile,
} = require("../controller/facultyController");

router.put(
	"/updateImage",
	passport.authenticate("jwt", { session: false }),
	upload.single("avatar"),
	updateImage
);
router.put(
	"/updateProfile",
	passport.authenticate("jwt", { session: false }),
	updateProfile
);
router.post(
	"/fetchAllSubjects",
	passport.authenticate("jwt", { session: false }),
	getAllSubjects
);

router.post(
	"/markAttendence",
	passport.authenticate("jwt", { session: false }),
	markAttendence
);

router.post(
	"/updatePassword",
	passport.authenticate("jwt", { session: false }),
	updatePassword
);

module.exports = router;
