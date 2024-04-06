const express = require("express");
const passport = require("passport");
const router = express.Router();
const upload = require("../utils/multer");

const {
	checkAttendence,
	getAllStudents,
	getStudentByName,
	updatePassword,
	getStudentByRegName,
	postPrivateChat,
	getPrivateChat,
	differentChats,
	previousChats,
	updateProfile,
	getAllSubjects,
	getMarks,
	updateImage,
	getProfile,
} = require("../controller/studentController");

//UPLOAD PROFILE
router.put(
	"/updateProfile",
	passport.authenticate("jwt", { session: false }),
	updateProfile
);
router.put(
	"/updateImage",
	passport.authenticate("jwt", { session: false }),
	upload.single("avatar"),
	updateImage
);
router.get(
	"/getProfile",
	passport.authenticate("jwt", { session: false }),
	getProfile
);
//UPLOAD PASSWORD
router.post(
	"/updatePassword",
	passport.authenticate("jwt", { session: false }),
	updatePassword
);

//CHAT RELATED ROUTES
router.get(
	"/chat/:roomId",
	passport.authenticate("jwt", { session: false }),
	getPrivateChat
);

router.post(
	"/chat/:roomId",
	passport.authenticate("jwt", { session: false }),
	postPrivateChat
);

router.get(
	"/chat/newerChats/:receiverName",
	passport.authenticate("jwt", { session: false }),
	differentChats
);

router.get(
	"/chat/previousChats/:senderName",
	passport.authenticate("jwt", { session: false }),
	previousChats
);

router.get(
	"/getMarks",
	passport.authenticate("jwt", { session: false }),
	getMarks
);

router.get(
	"/getAllSubjects",
	passport.authenticate("jwt", { session: false }),
	getAllSubjects
);

router.get(
	"/checkAttendence",
	passport.authenticate("jwt", { session: false }),
	checkAttendence
);

//HELPER ROUTES
router.post(
	"/getAllStudents",
	passport.authenticate("jwt", { session: false }),
	getAllStudents
);

router.post(
	"/getStudentByRegName",
	passport.authenticate("jwt", { session: false }),
	getStudentByRegName
);

router.post(
	"/getStudentByName",
	passport.authenticate("jwt", { session: false }),
	getStudentByName
);

module.exports = router;
