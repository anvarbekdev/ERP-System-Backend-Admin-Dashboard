const express = require("express");
const passport = require("passport");
const upload = require("../utils/multer");
const router = express.Router();

const {
	updatePassword,
	uploadPost,
	findAllNews,
	uploadGallery,
	findAllGallery,
	deletePost,
	deleteGallery,
	updateImage,
	updateProfile,
} = require("../controller/newsController");

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
router.post(
	"/deletePost",
	passport.authenticate("jwt", { session: false }),
	deletePost
);
router.post(
	"/deleteGallery",
	passport.authenticate("jwt", { session: false }),
	deleteGallery
);
router.get(
	"/getNews",
	// passport.authenticate("jwt", { session: false }),
	findAllNews
);
router.get(
	"/getGallery",
	// passport.authenticate("jwt", { session: false }),
	findAllGallery
);
router.post(
	"/addPost",
	passport.authenticate("jwt", { session: false }),
	upload.single("image"),
	uploadPost
);
router.post(
	"/addGallery",
	passport.authenticate("jwt", { session: false }),
	upload.single("image"),
	uploadGallery
);
router.post(
	"/updatePassword",
	passport.authenticate("jwt", { session: false }),
	updatePassword
);

module.exports = router;
