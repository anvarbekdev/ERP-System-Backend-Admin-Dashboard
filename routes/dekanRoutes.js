const express = require("express");
const router = express.Router();
const passport = require("passport");
const upload = require("../utils/multer");

const {
	addStudent,
	addSubject,
	deleteUser,
	updateStudents,
	findAllStudent,
	updatePassword,
	getStudentItem,
	deleteSubject,
	getProfile,
	updateImage,
	uploadMarks,
	fetchStudents,
	findAllSubject,
	updateSubjects,
	getSubjectItem,
	updateProfile,
} = require("../controller/dekanController");

router.put(
	"/updateProfile",
	passport.authenticate("jwt", { session: false }),
	updateProfile
);
router.post(
	"/updatePassword",
	passport.authenticate("jwt", { session: false }),
	updatePassword
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
// ============= UPLOAD MARK EXAMEN ======
router.post(
	"/fetchStudents",
	passport.authenticate("jwt", { session: false }),
	fetchStudents
);
router.post(
	"/uploadMarks",
	passport.authenticate("jwt", { session: false }),
	uploadMarks
);
// ========= SUBJECT =========
router.get(
	"/findAllSubject",
	passport.authenticate("jwt", { session: false }),
	findAllSubject
);
router.post(
	"/deleteSubject",
	passport.authenticate("jwt", { session: false }),
	deleteSubject
);
router.put(
	"/getSubjectDetail",
	passport.authenticate("jwt", { session: false }),
	updateSubjects
);
router.get(
	"/getSubjectDetail/:id",
	passport.authenticate("jwt", { session: false }),
	getSubjectItem
);
router.post(
	"/addSubject",
	passport.authenticate("jwt", { session: false }),
	addSubject
);
// ========= SUTUDENT =========
router.get(
	"/findAllStudent",
	passport.authenticate("jwt", { session: false }),
	findAllStudent
);
router.post(
	"/deleteStudent",
	passport.authenticate("jwt", { session: false }),
	deleteUser
);
router.put(
	"/getStudentDetail/:id",
	passport.authenticate("jwt", { session: false }),
	updateStudents
);
router.get(
	"/getStudentDetail/:id",
	passport.authenticate("jwt", { session: false }),
	getStudentItem
);
router.post(
	"/addStudent",
	passport.authenticate("jwt", { session: false }),
	addStudent
);

module.exports = router;
