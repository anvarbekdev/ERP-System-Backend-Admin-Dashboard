const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
//Validation
const validateFetchStudentsInput = require("../validation/facultyFetchStudent");
const validateFacultyUploadMarks = require("../validation/dekanUploadMarks");
const validateStudentRegisterInput = require("../validation/studentRegister");
const validateSubjectRegisterInput = require("../validation/subjectRegister");
const validateStudentUpdate = require("../validation/studentUpdate");
const validateUpdatePassword = require("../validation/updatePassword");

//Models
const Subject = require("../models/subject");
const Student = require("../models/student");
const Dekan = require("../models/dekan");
const Mark = require("../models/marks");

//File Handler
const bufferConversion = require("../utils/bufferConversion");
const cloudinary = require("../utils/cloudinary");

//Config

module.exports = {
	fetchStudents: async (req, res, next) => {
		try {
			const { errors, isValid } = validateFetchStudentsInput(req.body);
			if (!isValid) {
				return res.status(400).json(errors);
			}
			if (!req.user) {
				return res.status(401).json({ error: "Unauthorized" });
			}
			const { department, year, section } = req.body;

			const Department = await Student.findOne({ department });

			const subjects = await Subject.find({ department, year });

			if (subjects.length === 0) {
				errors.year = "Fan Topilmadi";
				return res.status(404).json(errors);
			}
			if (Department.length === 0) {
				errors.department = "Faculty Topilmadi";
				return res.status(404).json(errors);
			}
			const Year = await Student.find({ department, year });
			if (Year.length === 0) {
				errors.year = "Course not found!";
				return res.status(404).json(errors);
			}
			const students = await Student.find({ department, year, section });
			if (students.length === 0) {
				errors.section = "There is no group";
				return res.status(404).json(errors);
			}

			res.status(200).json({
				result: students.map((student) => {
					var student = {
						_id: student._id,
						registrationNumber: student.registrationNumber,
						name: student.name,
					};
					return student;
				}),
				subjectName: subjects.map((sub) => {
					return sub.subjectName;
				}),
				subjectName: subjects.map((sub) => {
					return sub.subjectName;
				}),
			});
		} catch (err) {
			console.log("error in faculty fetchStudents", err.message);
		}
	},
	uploadMarks: async (req, res, next) => {
		try {
			const { errors, isValid } = validateFacultyUploadMarks(req.body);

			// Check Validation
			if (!isValid) {
				return res.status(400).json(errors);
			}
			const {
				subjectName,
				exam,
				totalMarks,
				marks,
				department,
				section,
				year,
			} = req.body;
			var date = new Date();
			const subject = await Subject.find({ department, year, subjectName });
			const uploadYear = date.getFullYear();
			const isAlready = await Mark.find({
				subject: subject._id,
				exam,
				subjectName,
				section,
			});
			// console.log("sss"+isAlready);
			if (isAlready.length !== 0) {
				errors.exam = "Siz allaqachon berilgan imtihon baholarini yuklagansiz!";
				return res.status(400).json(errors);
			}
			for (var i = 0; i < marks.length; i++) {
				const newMarks = await new Mark({
					student: marks[i]._id,
					subject: subject._id,
					exam,
					department,
					section,
					subjectName,
					marks: marks[i].value,
					uploadYear,
					totalMarks,
				});
				await newMarks.save();
			}
			res.status(200).json({ message: "Evaluation yuklandi!" });
		} catch (err) {
			console.log("Error in uploading marks", err.message);
		}
	},
	findAllSubject: async (req, res, next) => {
		try {
			const { department } = req.user;
			const total = await Subject.find({ department });
			res.status(200).json(total);
		} catch (error) {
			console.log(error.message);
		}
	},
	findAllStudent: async (req, res, next) => {
		try {
			const { department } = req.user;

			const search = req.query.search || "";
			const section = req.query.section || "";
			let Year = req.query.year || 0;

			const genreCours = [1, 2, 3, 4];

			Year === 0
				? (Year = [...genreCours])
				: (Year = req.query.year.split(","));

			const studentName = await Student.find({
				department,
				name: { $regex: search, $options: "i" },
				section: { $regex: section, $options: "i" },
			})
				.where("year")
				.in([...Year]);

			const total = await Student.countDocuments({
				department,
				year: { $in: [...Year] },
				section: { $regex: section, $options: "i" },
				name: { $regex: search, $options: "i" },
			});
			const response = {
				error: false,
				total,
				years: genreCours,
				studentName,
			};

			res.status(200).json(response);
		} catch (error) {
			console.log(error.message);
		}
	},
	deleteUser: async (req, res) => {
		try {
			const { registrationNumber } = req.body;
			const deletefind = await Student.findOne({ registrationNumber });
			const deleteduser = await Student.deleteOne({ _id: deletefind._id });
			res.status(200).json(deleteduser);
		} catch (error) {
			res.status(400).json({ message: error.message });
		}
	},
	deleteSubject: async (req, res) => {
		try {
			const { subjectName } = req.body;
			const deletefind = await Subject.findOne({ subjectName });
			const deleteduser = await Subject.deleteOne({ _id: deletefind._id });
			res.status(200).json(deleteduser);
		} catch (error) {
			res.status(400).json({ message: error.message });
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
			const dekan = await Dekan.findOne({ registrationNumber });
			const isCorrect = await bcrypt.compare(oldPassword, dekan.password);
			if (!isCorrect) {
				errors.oldPassword = "xato eski parol";
				return res.status(404).json(errors);
			}
			let hashedPassword;
			hashedPassword = await bcrypt.hash(newPassword, 10);
			dekan.password = hashedPassword;
			await dekan.save();
			res.status(200).json({ message: "Password Updated" });
		} catch (err) {
			console.log("Error in updating password", err.message);
		}
	},
	updateSubjects: async (req, res, next) => {
		try {
			const { department, subjectName, year } = req.body;
			const subject = await Subject.exists({ subjectName, year, department });
			if (subject) {
				errors.subjectName = "Fan Mavjud";
				return res.status(400).json(errors);
			}
			const data = await Subject.findOneAndUpdate(
				{ _id: req.body._id },
				req.body,
				{ new: true }
			);

			res.status(200).json({ message: "Subject updated successfully", data });
		} catch (error) {
			console.log(error.message);
			res.status(500).json({ message: "Server error" });
		}
	},
	updateStudents: async (req, res, next) => {
		const { errors, isValid } = validateStudentUpdate(req.body);
		try {
			if (!isValid) {
				res.status(404).json(errors);
			} else {
				const data = await Student.findOneAndUpdate(
					{ registrationNumber: req.params.id },
					req.body,
					{ new: true }
				);

				res
					.status(200)
					.json({ message: "Students updated successfully", data });
			}
		} catch (error) {
			console.log(error.message);
			res.status(500).json({ message: "Server error" });
		}
	},
	getSubjectItem: async (req, res, next) => {
		try {
			const data = await Subject.findOne({ subjectName: req.params.id });
			res.status(200).json(data);
		} catch (err) {
			console.log("Error in updating Profile", err.message);
		}
	},
	getStudentItem: async (req, res, next) => {
		try {
			const data = await Student.findOne({ registrationNumber: req.params.id });
			res.status(200).json(data);
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

			const data = await Dekan.findOneAndUpdate(
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
			console.log("Error in updating Profile", err.message);
		}
	},
	getProfile: async (req, res, next) => {
		try {
			const { _id } = req.user;
			// console.log(_id);
			const User = await Dekan.findOne({ _id: _id });

			res.status(200).json(User);
		} catch (err) {
			console.log("Error in gettting all faculties", err.message);
		}
	},
	getStudentDetail: async (req, res, next) => {
		try {
			const { _id } = req.body;
			// console.log(_id);
			const User = await Student.find({ _id: _id });

			res.status(200).json({ result: User });
		} catch (err) {
			console.log("Error in gettting all faculties", err.message);
		}
	},
	addStudent: async (req, res, next) => {
		try {
			const { errors, isValid } = validateStudentRegisterInput(req.body);
			if (!isValid) {
				return res.status(400).json(errors);
			}
			const {
				name,
				year,
				fatherName,
				gender,
				department,
				section,
				dob,
				registrationNumber,
				studentMobileNumber,
				fatherMobileNumber,
			} = req.body;
			const regnum = await Student.findOne({ registrationNumber });
			if (regnum) {
				errors.registrationNumber = "Reg Number mavjud";
				return res.status(400).json(errors);
			}
			const avatar = gravatar.url(registrationNumber, {
				s: "200",
				r: "pg",
				d: "mm",
			});
			let hashedPassword;
			hashedPassword = await bcrypt.hash(dob, 10);
			var date = new Date();
			const batch = date.getFullYear();
			const newStudent = await new Student({
				name,
				password: hashedPassword,
				year,
				fatherName,
				gender,
				registrationNumber,
				department,
				section,
				batch,
				avatar,
				dob,
				studentMobileNumber,
				fatherMobileNumber,
			});
			await newStudent.save();
			const subjects = await Subject.find({ year });
			if (subjects.length !== 0) {
				for (var i = 0; i < subjects.length; i++) {
					newStudent.subjects.push(subjects[i]._id);
				}
			}
			await newStudent.save();
			res.status(200).json({ result: newStudent });
		} catch (err) {
			res
				.status(400)
				.json({ message: `error in adding new student", ${err.message}` });
		}
	},
	addSubject: async (req, res, next) => {
		try {
			//Validation
			const { errors, isValid } = validateSubjectRegisterInput(req.body);
			// console.log(req.user);
			if (!isValid) {
				return res.status(400).json(errors);
			}
			const { totalLectures, department, subjectName, year } = req.body;
			const subject = await Subject.exists({ subjectName, year, department });
			if (subject) {
				errors.subjectName = "Fan Mavjud";
				return res.status(400).json(errors);
			}
			const newSubject = await new Subject({
				totalLectures,
				department,
				subjectName,
				year,
			});
			const students = await Student.find({ department, year });

			if (students.length === 0) {
				errors.department = "Hozirda talabalar mavjud emas!";
				return res.status(400).json(errors);
			} else {
				await newSubject.save();
				for (var i = 0; i < students.length; i++) {
					students[i].subjects.push(newSubject._id);
					await students[i].save();
				}
				res.status(200).json({ newSubject, message: "Fan Qo'shildi" });
			}
		} catch (err) {
			console.log(`error in adding new subject", ${err.message}`);
		}
	},
	updateProfile: async (req, res, next) => {
		try {
			const data = await Dekan.findOneAndUpdate(
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
