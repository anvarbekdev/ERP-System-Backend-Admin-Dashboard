const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/nodemailer");

//Validation
const validateAdminLoginInput = require("../validation/adminLogin");
const validateForgotPassword = require("../validation/forgotPassword");
const validateOTP = require("../validation/otpValidation");
//Models
const Student = require("../models/student");
const Faculty = require("../models/faculty");
const Admin = require("../models/admin");
const Newsadmin = require("../models/newsadmin");
const Dekan = require("../models/dekan");

//Config
const keys = require("../config/key");

module.exports = {
	multipleLogin: async (req, res, next) => {
		try {
			const { errors, isValid } = validateAdminLoginInput(req.body);
			// Check Validation
			if (!isValid) {
				return res.status(400).json(errors);
			}
			const { registrationNumber, password } = req.body;

			const admin = await Admin.findOne({ registrationNumber });
			const dekan = await Dekan.findOne({ registrationNumber });
			const faculty = await Faculty.findOne({ registrationNumber });
			// const news = await Newsadmin.findOne({ registrationNumber });
			const student = await Student.findOne({ registrationNumber });
			if (admin) {
				const isCorrect = await bcrypt.compare(password, admin.password);
				if (!isCorrect) {
					errors.password = "Yaroqsiz parol!";
					return res.status(404).json(errors);
				}

				const match = await bcrypt.compare(admin.dob, admin.password);
				if (match) {
					const payload = {
						id: admin.id,
						name: admin.name,
						email: admin.email,
						dob: admin.dob,
						contactNumber: admin.contactNumber,
						avatar: admin.avatar,
						registrationNumber: admin.registrationNumber,
						joiningYear: admin.joiningYear,
						department: admin.department,
						showModal: true,
						text: "admin",
					};
					jwt.sign(
						payload,
						keys.secretOrKey,
						{ expiresIn: 7200 },
						(err, token) => {
							res.json({
								success: true,
								token: "Bearer " + token,
							});
						}
					);
				} else {
					const payload = {
						id: admin.id,
						name: admin.name,
						email: admin.email,
						dob: admin.dob,
						contactNumber: admin.contactNumber,
						avatar: admin.avatar,
						registrationNumber: admin.registrationNumber,
						joiningYear: admin.joiningYear,
						department: admin.department,
						showModal: false,
						text: "admin",
					};
					jwt.sign(
						payload,
						keys.secretOrKey,
						{ expiresIn: 7200 },
						(err, token) => {
							res.json({
								success: true,
								token: "Bearer " + token,
							});
						}
					);
				}
			} else if (dekan) {
				const isCorrect = await bcrypt.compare(password, dekan.password);
				if (!isCorrect) {
					errors.password = "Yaroqsiz parol!";
					return res.status(404).json(errors);
				}
				const match = await bcrypt.compare(dekan.dob, dekan.password);
				if (match) {
					const payload = {
						id: dekan.id,
						dekan,
						text: "dekan",
						showModal: true,
					};
					jwt.sign(
						payload,
						keys.secretOrKey,
						{ expiresIn: 3600 },
						(err, token) => {
							res.json({
								success: true,
								token: "Bearer " + token,
							});
						}
					);
				} else {
					const payload = {
						id: dekan.id,
						dekan,
						text: "dekan",
						showModal: false,
					};
					jwt.sign(
						payload,
						keys.secretOrKey,
						{ expiresIn: 3600 },
						(err, token) => {
							res.json({
								success: true,
								token: "Bearer " + token,
							});
						}
					);
				}
			} else if (faculty) {
				const isCorrect = await bcrypt.compare(password, faculty.password);
				if (!isCorrect) {
					errors.password = "Password is incorrect!";
					return res.status(404).json(errors);
				}
				const match = await bcrypt.compare(faculty.dob, faculty.password);
				if (match) {
					const payload = {
						id: faculty.id,
						faculty,
						text: "faculty",
						showModal: true,
					};
					jwt.sign(
						payload,
						keys.secretOrKey,
						{ expiresIn: 3600 },
						(err, token) => {
							res.json({
								success: true,
								token: "Bearer " + token,
							});
						}
					);
				} else {
					const payload = {
						id: faculty.id,
						faculty,
						text: "faculty",
						showModal: false,
					};
					jwt.sign(
						payload,
						keys.secretOrKey,
						{ expiresIn: 3600 },
						(err, token) => {
							res.json({
								success: true,
								token: "Bearer " + token,
							});
						}
					);
				}
			} else if (student) {
				const isCorrect = await bcrypt.compare(password, student.password);
				if (!isCorrect) {
					errors.password = "Invalid Password";
					return res.status(404).json(errors);
				}
				const match = await bcrypt.compare(student.dob, student.password);
				if (match) {
					const payload = {
						id: student.id,
						student,
						text: "student",
						showModal: true,
					};
					jwt.sign(
						payload,
						keys.secretOrKey,
						{ expiresIn: 3600 },
						(err, token) => {
							res.json({
								success: true,
								token: "Bearer " + token,
							});
						}
					);
				} else {
					const payload = {
						id: student.id,
						student,
						text: "student",
						showModal: false,
					};
					jwt.sign(
						payload,
						keys.secretOrKey,
						{ expiresIn: 3600 },
						(err, token) => {
							res.json({
								success: true,
								token: "Bearer " + token,
							});
						}
					);
				}
			} else {
				errors.registrationNumber = "Registration number not found!";
				return res.status(404).json(errors);
			}

			// else if (news) {
			// 	const isCorrect = await bcrypt.compare(password, news.password);
			// 	if (!isCorrect) {
			// 		errors.password = "Password is incorrect!";
			// 		return res.status(404).json(errors);
			// 	}

			// 	const match = await bcrypt.compare(news.dob, news.password);
			// 	if (match) {
			// 		const payload = {
			// 			id: news.id,
			// 			news,
			// 			text: "news",
			// 			showModal: true,
			// 		};
			// 		jwt.sign(
			// 			payload,
			// 			keys.secretOrKey,
			// 			{ expiresIn: 3600 },
			// 			(err, token) => {
			// 				res.json({
			// 					success: true,
			// 					token: "Bearer " + token,
			// 				});
			// 			}
			// 		);
			// 	} else {
			// 		const payload = {
			// 			id: news.id,
			// 			news,
			// 			text: "news",
			// 			showModal: false,
			// 		};
			// 		jwt.sign(
			// 			payload,
			// 			keys.secretOrKey,
			// 			{ expiresIn: 3600 },
			// 			(err, token) => {
			// 				res.json({
			// 					success: true,
			// 					token: "Bearer " + token,
			// 				});
			// 			}
			// 		);
			// 	}
			// } 
		} catch (err) {
			console.log("Error in admin login", err.message);
		}
	},
	forgotPassword: async (req, res, next) => {
		try {
			const { errors, isValid } = validateForgotPassword(req.body);
			if (!isValid) {
				return res.status(400).json(errors);
			}
			const { email } = req.body;
			const faculty = await Faculty.findOne({ email });
			const dekan = await Dekan.findOne({ email });
			const admin = await Admin.findOne({ email });
			const student = await Student.findOne({ email });
			const news = await Newsadmin.findOne({ email });
			if (faculty) {
				function generateOTP() {
					var digits = "0123456789";
					let OTP = "";
					for (let i = 0; i < 6; i++) {
						OTP += digits[Math.floor(Math.random() * 10)];
					}
					return OTP;
				}
				const OTP = await generateOTP();
				faculty.otp = OTP;
				await faculty.save();
				await sendEmail(faculty.email, OTP, "OTP");
				res
					.status(200)
					.json({ message: "check your registered email for OTP" });
				const helper = async () => {
					faculty.otp = "";
					await faculty.save();
				};
				setTimeout(function () {
					helper();
				}, 180000);
			} else if (dekan) {
				function generateOTP() {
					var digits = "0123456789";
					let OTP = "";
					for (let i = 0; i < 6; i++) {
						OTP += digits[Math.floor(Math.random() * 10)];
					}
					return OTP;
				}
				const OTP = await generateOTP();
				dekan.otp = OTP;
				await dekan.save();
				await sendEmail(dekan.email, OTP, "OTP");
				res
					.status(200)
					.json({ message: "check your registered email for OTP" });
				const helper = async () => {
					dekan.otp = "";
					await dekan.save();
				};
				setTimeout(function () {
					helper();
				}, 180000);
			} else if (admin) {
				function generateOTP() {
					var digits = "0123456789";
					let OTP = "";
					for (let i = 0; i < 6; i++) {
						OTP += digits[Math.floor(Math.random() * 10)];
					}
					return OTP;
				}
				const OTP = await generateOTP();
				admin.otp = OTP;
				await admin.save();
				await sendEmail(admin.email, OTP, "OTP");
				res
					.status(200)
					.json({ message: "check your registered email for OTP" });
				const helper = async () => {
					admin.otp = "";
					await admin.save();
				};
				setTimeout(function () {
					helper();
				}, 180000);
			} else if (student) {
				function generateOTP() {
					var digits = "0123456789";
					let OTP = "";
					for (let i = 0; i < 6; i++) {
						OTP += digits[Math.floor(Math.random() * 10)];
					}
					return OTP;
				}
				const OTP = await generateOTP();
				student.otp = OTP;
				await student.save();
				await sendEmail(student.email, OTP, "OTP");
				res
					.status(200)
					.json({ message: "check your registered email for OTP" });
				const helper = async () => {
					student.otp = "";
					await student.save();
				};
				setTimeout(function () {
					helper();
				}, 180000);
			} else if (news) {
				function generateOTP() {
					var digits = "0123456789";
					let OTP = "";
					for (let i = 0; i < 6; i++) {
						OTP += digits[Math.floor(Math.random() * 10)];
					}
					return OTP;
				}
				const OTP = await generateOTP();
				news.otp = OTP;
				await news.save();
				await sendEmail(news.email, OTP, "OTP");
				res
					.status(200)
					.json({ message: "check your registered email for OTP" });
				const helper = async () => {
					news.otp = "";
					await news.save();
				};
				setTimeout(function () {
					helper();
				}, 180000);
			} else {
				errors.email = "Email Not found, Provide registered email";
				return res.status(400).json(errors);
			}
		} catch (err) {
			console.log("Error in sending email", err.message);
		}
	},
	postOTP: async (req, res, next) => {
		try {
			const { errors, isValid } = validateOTP(req.body);
			if (!isValid) {
				return res.status(400).json(errors);
			}
			const { email, otp, newPassword, confirmNewPassword } = req.body;
			if (newPassword !== confirmNewPassword) {
				errors.confirmNewPassword = "Password is mismatch";
				return res.status(400).json(errors);
			}
			const faculty = await Faculty.findOne({ email });
			const dekan = await Dekan.findOne({ email });
			const admin = await Admin.findOne({ email });
			const student = await Student.findOne({ email });
			const news = await Newsadmin.findOne({ email });
			if (faculty) {
				if (faculty.otp !== otp) {
					errors.otp = "Invalid OTP, check your email again";
					return res.status(400).json(errors);
				}
				let hashedPassword;
				hashedPassword = await bcrypt.hash(newPassword, 10);
				faculty.password = hashedPassword;
				await faculty.save();
			} else if (dekan) {
				if (dekan.otp !== otp) {
					errors.otp = "Invalid OTP, check your email again";
					return res.status(400).json(errors);
				}
				let hashedPassword;
				hashedPassword = await bcrypt.hash(newPassword, 10);
				dekan.password = hashedPassword;
				await dekan.save();
			} else if (admin) {
				if (admin.otp !== otp) {
					errors.otp = "Invalid OTP, check your email again";
					return res.status(400).json(errors);
				}
				let hashedPassword;
				hashedPassword = await bcrypt.hash(newPassword, 10);
				admin.password = hashedPassword;
				await admin.save();
			} else if (student) {
				if (student.otp !== otp) {
					errors.otp = "Invalid OTP, check your email again";
					return res.status(400).json(errors);
				}
				let hashedPassword;
				hashedPassword = await bcrypt.hash(newPassword, 10);
				student.password = hashedPassword;
				await student.save();
			} else if (news) {
				if (news.otp !== otp) {
					errors.otp = "Invalid OTP, check your email again";
					return res.status(400).json(errors);
				}
				let hashedPassword;
				hashedPassword = await bcrypt.hash(newPassword, 10);
				news.password = hashedPassword;
				await news.save();
			}
			return res.status(200).json({ message: "Password Changed" });
		} catch (err) {
			console.log("Error in submitting otp", err.message);
			return res.status(200);
		}
	},
};
