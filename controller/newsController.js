const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/nodemailer");
const Gallery = require("../models/newsGallery");
const News = require("../models/news");
const Newsadmin = require("../models/newsadmin");

const keys = require("../config/key");

//File Handler
const bufferConversion = require("../utils/bufferConversion");
const cloudinary = require("../utils/cloudinary");

const validateNewsPostInput = require("../validation/newsPost");
const validateGalleryInput = require("../validation/newsGallery");
const validateUpdatePassword = require("../validation/updatePassword");

module.exports = {
	uploadGallery: async (req, res, next) => {
		try {
			const { errors, isValid } = validateGalleryInput(req.body);
			// Importing module
			const date = require("date-and-time");
			// Check Validation
			if (!isValid) {
				return res.status(400).json(errors);
			}

			const { title } = req.body;
			const news = await Gallery.findOne({ title });
			if (news) {
				errors.title = "Sarlavha allaqachon mavjud!";
				return res.status(400).json(errors);
			}

			const ImageUpload = await bufferConversion(
				req.file.originalname,
				req.file.buffer
			);
			const imgResponse = await cloudinary.uploader.upload(ImageUpload);

			var now = new Date();
			const value = date.format(now, "YYYY/MM/DD HH:mm");
			const GalleryUpl = await new Gallery({
				title,
				image: imgResponse.secure_url,
				uploadtime: value,
			});
			await GalleryUpl.save();
			return res.status(200).json({
				success: true,
				message: "Image Upload successfully",
				response: GalleryUpl,
			});
		} catch (err) {
			return res
				.status(400)
				.json({ message: `Rasim Qo'yilmadi ${err.message}` });
		}
	},
	uploadPost: async (req, res, next) => {
		try {
			const { errors, isValid } = validateNewsPostInput(req.body);
			// Importing module
			const date = require("date-and-time");

			// Check Validation
			if (!isValid) {
				return res.status(400).json(errors);
			}

			const { title, desc, muallif } = req.body;
			const news = await News.findOne({ title });
			if (news) {
				errors.title = "Sarlavha allaqachon mavjud!";
				return res.status(400).json(errors);
			}
			// const url = req.protocol + '://' + req.get('host')

			const ImageUpload = await bufferConversion(
				req.file.originalname,
				req.file.buffer
			);
			// console.log(ImageUpload);
			const imgResponse = await cloudinary.uploader.upload(ImageUpload);

			var now = new Date();
			const value = date.format(now, "YYYY/MM/DD HH:mm");
			const newPost = await new News({
				title,
				desc,
				image: imgResponse.secure_url,
				uploadtime: value,
				muallif,
			});
			await newPost.save();
			return res.status(200).json({
				success: true,
				message: "Admin registerd successfully",
				response: newPost,
			});
		} catch (err) {
			return res
				.status(400)
				.json({ message: `Rasim Qo'yilmadi ${err.message}` });
		}
	},
	updatePassword: async (req, res, next) => {
		try {
			const { errors, isValid } = validateUpdatePassword(req.body);
			if (!isValid) {
				return res.status(400).json(errors);
			}
			const {
				registrationNumber,
				oldPassword,
				newPassword,
				confirmNewPassword,
			} = req.body;
			if (newPassword !== confirmNewPassword) {
				errors.confirmNewPassword = "Password is mismatch!";
				return res.status(404).json(errors);
			}
			const news = await Newsadmin.findOne({ registrationNumber });
			const isCorrect = await bcrypt.compare(oldPassword, news.password);
			if (!isCorrect) {
				errors.oldPassword = "xato eski parol";
				return res.status(404).json(errors);
			}
			let hashedPassword;
			hashedPassword = await bcrypt.hash(newPassword, 10);
			news.password = hashedPassword;
			await news.save();
			res.status(200).json({ message: "Password Updated" });
		} catch (err) {
			console.log("Error in updating password", err.message);
		}
	},
	findAllGallery: async (req, res, next) => {
		// const skip = req.query.skip ? Number(req.query.skip) : 0;
		// const DEFAULT_LIMIT = 10;
		console.log("hello");
		try {
			const gallery = await Gallery.find({});
			// .skip(skip).limit(DEFAULT_LIMIT);
			res.status(200).json(gallery);
		} catch (err) {
			console.log("Error in updating Profile", err.message);
		}
	},
	findAllNews: async (req, res, next) => {
		// const skip = req.query.skip ? Number(req.query.skip) : 0;
		// const DEFAULT_LIMIT = 10;
		try {
			const news = await News.find({});
			console.log(news);
			// .skip(skip).limit(DEFAULT_LIMIT);

			res.status(200).json(news);
		} catch (err) {
			console.log("Error in updating Profile", err.message);
		}
	},
	updateImage: async (req, res, next) => {
		try {
			const userPostImg = await bufferConversion(
				req.file.originalname,
				req.file.buffer
			);
			const imgResponse = await cloudinary.uploader.upload(userPostImg);

			const data = await Newsadmin.findOneAndUpdate(
				{ _id: req.user._id },
				{
					avatar: imgResponse.secure_url,
				},
				{ new: true, runValidators: true }
			);
			res.status(201).json({
				data: data,
				message: "User profile picture updated successfully!. Log in again!",
			});
		} catch (err) {
			res.status(404).json({
				message: "Rasim tanlanmagan!",
			});
		}
	},
	deletePost: async (req, res) => {
		try {
			const { _id } = req.body;
			// console.log(req.body);
			const deletedPost = await News.deleteOne({ _id: _id });
			res.status(200).json(deletedPost);
		} catch (error) {
			res.status(400).json({ message: error.message });
		}
	},
	deleteGallery: async (req, res) => {
		try {
			const { _id } = req.body;
			const deleteGaller = await Gallery.deleteOne({ _id: _id });
			res.status(200).json(deleteGaller);
		} catch (error) {
			res.status(400).json({ message: error.message });
		}
	},
	updateProfile: async (req, res, next) => {
		try {
			const data = await Newsadmin.findOneAndUpdate(
				{ _id: req.user.id },
				{ email: req.body.email },
				{ new: true }
			);
			res.status(200).json({ message: "Email connected. Login again!", data });
		} catch (error) {
			res.status(500).json({ message: "Server error" });
		}
	},
};
