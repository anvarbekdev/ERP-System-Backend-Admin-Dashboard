const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/nodemailer");
const Student = require("../models/student");
const Subject = require("../models/subject");
const Faculty = require("../models/faculty");
const Attendence = require("../models/attendence");

//File Handler
const bufferConversion = require("../utils/bufferConversion");
const cloudinary = require("../utils/cloudinary");

const validateFacultyUploadAttendace = require("../validation/facultyAttendace");
const validateUpdatePassword = require("../validation/updatePassword");

module.exports = {
	markAttendence: async (req, res, next) => {
		try {
			const { errors, isValid } = validateFacultyUploadAttendace(req.body);

			// Check Validation
			if (!isValid) {
				return res.status(400).json(errors);
			}
			const { selectedStudents, subjectName, department, year, section } =
				req.body;
			const subs = await Subject.find({ department, year, subjectName });
			const sub = subs.map((a) => a._id);

			//All Students
			const allStudents = await Student.find({ department, year, section });

			var filteredArr = allStudents.filter(function (item) {
				return selectedStudents.indexOf(item.id) === -1;
			});
			// console.log(filteredArr);

			//Attendence mark karne wale log nahi
			for (let i = 0; i < filteredArr.length; i++) {
				const pre = await Attendence.findOne({
					student: filteredArr[i]._id,
					subject: sub,
				});
				if (!pre) {
					const attendence = new Attendence({
						student: filteredArr[i],
						subject: sub,
					});
					attendence.totalLecturesByFaculty += 1;

					await attendence.save();
				} else {
					pre.totalLecturesByFaculty += 1;
					await pre.save();
				}
			}
			for (var a = 0; a < selectedStudents.length; a++) {
				const pre = await Attendence.findOne({
					student: selectedStudents[a],
					subject: sub,
				});
				if (!pre) {
					const attendence = new Attendence({
						student: selectedStudents[a],
						subject: sub,
					});
					attendence.totalLecturesByFaculty += 1;
					attendence.lectureAttended += 1;
					await attendence.save();
				} else {
					pre.totalLecturesByFaculty += 1;
					pre.lectureAttended += 1;
					await pre.save();
				}
			}
			res.status(200).json({ message: "done" });
		} catch (err) {
			console.log("error", err.message);
			return res
				.status(400)
				.json({ message: `Error in marking attendence${err.message}` });
		}
	},
	getAllSubjects: async (req, res, next) => {
		try {
			const allSubjects = await Subject.find({});
			if (!allSubjects) {
				return res
					.status(404)
					.json({ message: "You havent registered any subject yet." });
			}
			res.status(200).json({ allSubjects });
		} catch (err) {
			res
				.status(400)
				.json({ message: `error in getting all Subjects", ${err.message}` });
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
			const faculty = await Faculty.findOne({ registrationNumber });
			const isCorrect = await bcrypt.compare(oldPassword, faculty.password);
			if (!isCorrect) {
				errors.oldPassword = "xato eski parol";
				return res.status(404).json(errors);
			}
			let hashedPassword;
			hashedPassword = await bcrypt.hash(newPassword, 10);
			faculty.password = hashedPassword;
			await faculty.save();
			res.status(200).json({ message: "Password Updated" });
		} catch (err) {
			console.log("Error in updating password", err.message);
		}
	},
	updateImage: async (req, res, next) => {
		try {
			const userPostImg = await bufferConversion(
				req.file.originalname,
				req.file.buffer
			);
			const imgResponse = await cloudinary.uploader.upload(userPostImg);

			const data = await Faculty.findOneAndUpdate(
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
	updateProfile: async (req, res, next) => {
		try {
			const data = await Faculty.findOneAndUpdate(
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
