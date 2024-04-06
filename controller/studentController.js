const bcrypt = require("bcryptjs");
const sendMail = require("../utils/nodemailer");
const Student = require("../models/student");
const Subject = require("../models/subject");
const Attendence = require("../models/attendence");
const Message = require("../models/message");
const Mark = require("../models/marks");
//File Handler
const bufferConversion = require("../utils/bufferConversion");
const cloudinary = require("../utils/cloudinary");

const myStudentRegister = require("../validation/myStudentRegister");
const validateUpdatePassword = require("../validation/updatePassword");

module.exports = {
	getAllStudents: async (req, res, next) => {
		try {
			const { department, year, section } = req.body;
			const students = await Student.find({ department, year, section });
			if (students.length === 0) {
				return res.status(400).json({ message: "No student found" });
			}
			return res.status(200).json({ result: students });
		} catch (err) {
			return res.status(400).json({ message: err.message });
		}
	},
	getStudentByName: async (req, res, next) => {
		try {
			const { name } = req.body;
			const students = await Student.find({ name });
			if (students.length === 0) {
				return res.status(400).json({ message: "No student found" });
			}
			return res.status(200).json({ result: students });
		} catch (err) {
			return res.status(400).json({ message: err.message });
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
				errors.confirmNewPassword = "Password is mismatch";
				return res.status(400).json(errors);
			}
			const student = await Student.findOne({ registrationNumber });
			const isCorrect = await bcrypt.compare(oldPassword, student.password);
			if (!isCorrect) {
				errors.oldPassword = "Invalid old Password";
				return res.status(404).json(errors);
			}
			let hashedPassword;
			hashedPassword = await bcrypt.hash(newPassword, 10);
			student.password = hashedPassword;
			await student.save();
			res.status(200).json({ message: "Password Updated" });
		} catch (err) {
			console.log("Error in updating password", err.message);
		}
	},
	getStudentByRegName: async (req, res, next) => {
		try {
			const { registrationNumber } = req.body;
			const students = await Student.findOne({ registrationNumber });
			if (!students) {
				return res.status(400).json({ message: "No student found" });
			}
			return res.status(200).json({ result: students });
		} catch (err) {
			return res.status(400).json({ message: err.message });
		}
	},
	postPrivateChat: async (req, res, next) => {
		try {
			const {
				senderName,
				senderId,
				roomId,
				receiverRegistrationNumber,
				senderRegistrationNumber,
				message,
			} = req.body;

			const receiverStudent = await Student.findOne({
				registrationNumber: receiverRegistrationNumber,
			});
			const newMessage = await new Message({
				senderName,
				senderId,
				roomId,
				message,
				senderRegistrationNumber,
				receiverRegistrationNumber,
				receiverName: receiverStudent.name,
				receiverId: receiverStudent._id,
				createdAt: new Date(),
			});
			await newMessage.save();
		} catch (err) {
			console.log("Error in post private chat", err.message);
		}
	},
	getPrivateChat: async (req, res, next) => {
		try {
			const { roomId } = req.params;
			const swap = (input, value_1, value_2) => {
				let temp = input[value_1];
				input[value_1] = input[value_2];
				input[value_2] = temp;
			};
			const allMessage = await Message.find({ roomId });
			let tempArr = roomId.split(".");
			swap(tempArr, 0, 1);
			let secondRomId = tempArr[0] + "." + tempArr[1];
			const allMessage2 = await Message.find({ roomId: secondRomId });
			var conversation = allMessage.concat(allMessage2);
			conversation.sort();
			res.status(200).json({ result: conversation });
		} catch (err) {
			console.log("errr in getting private chat server side", err.message);
		}
	},
	differentChats: async (req, res, next) => {
		try {
			const { receiverName } = req.params;
			const newChatsTemp = await Message.find({ senderName: receiverName });
			// if (newChatsTemp.length === 0) {
			//    return res.status(404).json({ result: "No any new Chat" })
			// }
			var filteredObjTemp = newChatsTemp.map((obj) => {
				let filteredObjTemp = {
					senderName: obj.senderName,
					receiverName: obj.receiverName,
					senderRegistrationNumber: obj.senderRegistrationNumber,
					receiverRegistrationNumber: obj.receiverRegistrationNumber,
					receiverId: obj.receiverId,
				};
				return filteredObjTemp;
			});
			let filteredListTemp = [
				...new Set(filteredObjTemp.map(JSON.stringify)),
			].map(JSON.parse);

			// const { receiverName } = req.params
			const newChats = await Message.find({ receiverName });
			// if (newChats.length === 0) {
			//    return res.status(404).json({ result: "No any new Chat" })
			// }
			var filteredObj = newChats.map((obj) => {
				let filteredObj = {
					senderName: obj.senderName,
					receiverName: obj.receiverName,
					senderRegistrationNumber: obj.senderRegistrationNumber,
					receiverRegistrationNumber: obj.receiverRegistrationNumber,
					receiverId: obj.receiverId,
				};
				return filteredObj;
			});
			let filteredListPro = [...new Set(filteredObj.map(JSON.stringify))].map(
				JSON.parse
			);
			for (var i = 0; i < filteredListPro.length; i++) {
				for (var j = 0; j < filteredListTemp.length; j++) {
					if (
						filteredListPro[i].senderName === filteredListTemp[j].receiverName
					) {
						filteredListPro.splice(i, 1);
					}
				}
			}
			res.status(200).json({ result: filteredListPro });
		} catch (err) {
			console.log("Error in getting different chats", err.message);
		}
	},
	previousChats: async (req, res, next) => {
		try {
			const { senderName } = req.params;
			const newChats = await Message.find({ senderName });
			// if (newChats.length === 0) {
			//     res.status(404).json({ result: "No any new Chat" })
			// }
			var filteredObj = newChats.map((obj) => {
				let filteredObj = {
					senderName: obj.senderName,
					receiverName: obj.receiverName,
					senderRegistrationNumber: obj.senderRegistrationNumber,
					receiverRegistrationNumber: obj.receiverRegistrationNumber,
					receiverId: obj.receiverId,
				};
				return filteredObj;
			});
			var filteredList = [...new Set(filteredObj.map(JSON.stringify))].map(
				JSON.parse
			);
			console.log("filterdList", filteredList);
			res.status(200).json({ result: filteredList });
		} catch (err) {
			console.log("Error in getting previous chats", err.message);
		}
	},
	updateImage: async (req, res, next) => {
		try {
			const userPostImg = await bufferConversion(
				req.file.originalname,
				req.file.buffer
			);
			const imgResponse = await cloudinary.uploader.upload(userPostImg);

			const data = await Student.findOneAndUpdate(
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
			const data = await Student.findOneAndUpdate(
				{ _id: req.user.id },
				{ email: req.body.email },
				{ new: true }
			);
			res.status(200).json({ message: "Email connected. Login again!", data });
		} catch (error) {
			res.status(500).json({ message: "Server error" });
		}
	},
	getProfile: async (req, res, next) => {
		try {
			const { _id } = req.user;
			// console.log(_id);
			const User = await Student.findOne({ _id: _id });

			res.status(200).json(User);
		} catch (err) {
			console.log("Error in gettting all faculties", err.message);
		}
	},
	getAllSubjects: async (req, res, next) => {
		try {
			const { department, year } = req.user;
			const subjects = await Subject.find({ department, year });
			if (subjects.length === 0) {
				return res.status(404).json({ message: "No subjects founds" });
			}
			res.status(200).json({ result: subjects });
		} catch (err) {
			return res
				.status(400)
				.json({ "Error in getting all subjects": err.message });
		}
	},
	getMarks: async (req, res, next) => {
		try {
			const studentId = req.user.id;
			// console.log("req.user", req.user);
			const getMarks = await Mark.find({
				student: studentId,
			}).populate("subject");
			const CycleTest1 = getMarks.filter((obj) => {
				return obj.exam === "CycleTest1";
			});
			const CycleTest2 = getMarks.filter((obj) => {
				return obj.exam === "CycleTest2";
			});
			const Semester1 = getMarks.filter((obj) => {
				return obj.exam === "Semester1";
			});
			const CycleTest3 = getMarks.filter((obj) => {
				return obj.exam === "CycleTest3";
			});
			const CycleTest4 = getMarks.filter((obj) => {
				return obj.exam === "CycleTest4";
			});
			const Semester2 = getMarks.filter((obj) => {
				return obj.exam === "Semester2";
			});
			res.status(200).json({
				result: {
					CycleTest1,
					CycleTest2,
					Semester1,
					CycleTest3,
					CycleTest4,
					Semester2,
				},
			});
		} catch (err) {
			return res.status(400).json({ "Error in getting marks": err.message });
		}
	},
	checkAttendence: async (req, res, next) => {
		try {
			const studentId = req.user._id;
			// console.log(req.user);
			const checkAttendence = await Attendence.find({
				student: studentId,
			}).populate("subject");

			if (!checkAttendence) {
				res.status(400).json({ message: "Attendence not found" });
			}
			res.status(200).json({
				result: checkAttendence.map((att) => ({
					attendence: (
						(att.lectureAttended / att.totalLecturesByFaculty) *
						100
					).toFixed(2),
					subjectName: att.subject.subjectName,
					maxHours: att.subject.totalLectures,
					absentHours: att.totalLecturesByFaculty - att.lectureAttended,
					lectureAttended: att.lectureAttended,
					totalLecturesByFaculty: att.totalLecturesByFaculty,
				})),
			});
		} catch (err) {
			console.log("Error in fetching checkAttendence", err.message);
		}
	},
};
