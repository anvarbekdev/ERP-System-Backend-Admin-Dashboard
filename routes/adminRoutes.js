const express = require("express");
const router = express.Router();
const passport = require("passport");
const upload = require("../utils/multer");
const {
	addFaculty,
	addSubject,
	addAdmin,
	addDekan,
	addNewsAdmin,
	getAllFaculty,
	getDekanDetail,
	getAllSubject,
	getProfile,
	getDekans,
	findAllStudent,
	updateProfile,
	updatePassword,
	updateDekans,
	updateImage,
	deleteDekan,
	resetDekanPassword,
	deleteNewsAdmin,
	getNewsAdmin,
	resetPasswordNews,
	getNewsDetail,
	updateNewsAdmin,
	resetPasswordFaculty,
	deleteFaculty,
	resetStudentPassword,
	getFacultyDetail,
	updateFaculty,
} = require("../controller/adminController");

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
router.get(
	"/getProfile",
	passport.authenticate("jwt", { session: false }),
	getProfile
);
router.post(
	"/addAdmin",
	passport.authenticate("jwt", { session: false }),
	addAdmin
);
// ========== FACULTY ==========
router.get(
	"/getAllFaculty",
	passport.authenticate("jwt", { session: false }),
	getAllFaculty
);
router.get(
	"/getAllFaculty/:id",
	passport.authenticate("jwt", { session: false }),
	getFacultyDetail
);
router.post(
	"/deleteFaculty",
	passport.authenticate("jwt", { session: false }),
	deleteFaculty
);
router.post(
	"/addFaculty",
	passport.authenticate("jwt", { session: false }),
	addFaculty
);
router.put(
	"/updateFaculty",
	passport.authenticate("jwt", { session: false }),
	updateFaculty
);

// ====== DEKANS ========
router.post(
	"/addDekan",
	passport.authenticate("jwt", { session: false }),
	addDekan
);
router.post(
	"/deleteDekan",
	passport.authenticate("jwt", { session: false }),
	deleteDekan
);
router.get(
	"/getDekans",
	passport.authenticate("jwt", { session: false }),
	getDekans
);
router.get(
	"/getDekans/:id",
	passport.authenticate("jwt", { session: false }),
	getDekanDetail
);
router.put(
	"/updateDekan",
	passport.authenticate("jwt", { session: false }),
	updateDekans
);
router.post(
	"/resetPasswordDekan",
	passport.authenticate("jwt", { session: false }),
	resetDekanPassword
);

router.post(
	"/addNewsAdmin",
	passport.authenticate("jwt", { session: false }),
	addNewsAdmin
);
router.get(
	"/getNewsAdmin",
	passport.authenticate("jwt", { session: false }),
	getNewsAdmin
);
router.get(
	"/getNewsAdmin/:id",
	passport.authenticate("jwt", { session: false }),
	getNewsDetail
);
router.post(
	"/getNewsAdmin/:id",
	passport.authenticate("jwt", { session: false }),
	deleteNewsAdmin
);
router.put(
	"/getNewsAdmin/:id",
	passport.authenticate("jwt", { session: false }),
	updateNewsAdmin
);
router.post(
	"/resetPasswordNews",
	passport.authenticate("jwt", { session: false }),
	resetPasswordNews
);

router.post(
	"/getFacultyAdmin/:id",
	passport.authenticate("jwt", { session: false }),
	deleteFaculty
);
router.post(
	"/resetPasswordFaculty",
	passport.authenticate("jwt", { session: false }),
	resetPasswordFaculty
);
router.post(
	"/resetPasswordStudent",
	passport.authenticate("jwt", { session: false }),
	resetStudentPassword
);

// ====== STUDENTS ===========
router.get(
	"/findAllStudent",
	// passport.authenticate("jwt", { session: false }),
	findAllStudent,
);
router.post(
	"/getAllSubject",
	passport.authenticate("jwt", { session: false }),
	getAllSubject
);
router.post(
	"/addFaculty",
	passport.authenticate("jwt", { session: false }),
	addFaculty
);
router.post(
	"/addSubject",
	passport.authenticate("jwt", { session: false }),
	addSubject
);
router.post(
	"/updatePassword",
	passport.authenticate("jwt", { session: false }),
	updatePassword
);

module.exports = router;
