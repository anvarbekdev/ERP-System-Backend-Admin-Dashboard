const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const axios = require("axios");
var FormData = require("form-data");

//Validation
const validateFacultyRegisterInput = require("../validation/facultyRegister");
const validateAdminLoginInput = require("../validation/adminLogin");
const validateSubjectRegisterInput = require("../validation/subjectRegister");
const validateGetAllSubject = require("../validation/validateGetAllSubject");
const validateDekanRegisterInput = require("../validation/dekanRegister");
//Models
const Subject = require("../models/subject");
const Student = require("../models/student");
const Faculty = require("../models/faculty");
const Admin = require("../models/admin");
const Newsadmin = require("../models/newsadmin");
const Dekan = require("../models/dekan");

//File Handler
const bufferConversion = require("../utils/bufferConversion");
const cloudinary = require("../utils/cloudinary");

//Config
const keys = require("../config/key");
const validateStudentUpdate = require("../validation/studentUpdate");
const myStudentRegister = require("../validation/myStudentRegister");
const validateUpdatePassword = require("../validation/updatePassword");
const attendence = require("../models/attendence");

module.exports = {
  updateProfile: async (req, res, next) => {
    const { errors, isValid } = myStudentRegister(req.body);
    try {
      if (!isValid) {
        res.status(404).json(errors);
      } else {
        const data = await Admin.findOneAndUpdate(
          { _id: req.user.id },
          req.body,
          { new: true }
        );

        res.status(200).json({ message: "User updated successfully", data });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },
  getProfile: async (req, res, next) => {
    try {
      const { _id } = req.user;
      // console.log(_id);
      const User = await Admin.findOne({ _id: _id });

      res.status(200).json(User);
    } catch (err) {
      console.log("Error in gettting all faculties", err.message);
    }
  },
  resetStudentPassword: async (req, res, next) => {
    try {
      const { registrationNumber } = req.body;
      const all = await Student.findOne({ registrationNumber });
      let hashedPassword;
      hashedPassword = await bcrypt.hash(all.dob, 10);
      all.password = hashedPassword;
      await all.save();
      res.status(200).json({ message: "Password Updated" });
    } catch (err) {
      console.log("Error in updating password", err.message);
    }
  },
  resetDekanPassword: async (req, res, next) => {
    try {
      const { registrationNumber } = req.body;
      const all = await Dekan.findOne({ registrationNumber });
      let hashedPassword;
      hashedPassword = await bcrypt.hash(all.dob, 10);
      all.password = hashedPassword;
      await all.save();
      res.status(200).json({ message: "Password Updated" });
    } catch (err) {
      console.log("Error in updating password", err.message);
    }
  },
  resetPasswordNews: async (req, res, next) => {
    try {
      const { registrationNumber } = req.body;
      const all = await Newsadmin.findOne({ registrationNumber });
      let hashedPassword;
      hashedPassword = await bcrypt.hash(all.dob, 10);
      all.password = hashedPassword;
      await all.save();
      res.status(200).json({ message: "Password Updated" });
    } catch (err) {
      console.log("Error in updating password", err.message);
    }
  },
  resetPasswordFaculty: async (req, res, next) => {
    try {
      const { registrationNumber } = req.body;
      const all = await Faculty.findOne({ registrationNumber });
      let hashedPassword;
      hashedPassword = await bcrypt.hash(all.dob, 10);
      all.password = hashedPassword;
      await all.save();
      res.status(200).json({ message: "Password Updated" });
    } catch (err) {
      console.log("Error in updating password", err.message);
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
      const faculty = await Admin.findOne({ registrationNumber });
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
  addNewsAdmin: async (req, res, next) => {
    try {
      const { name, contactNumber, dob } = req.body;
      //VALIDATE REQUEST BODY
      if (!name || !contactNumber || !dob) {
        return res.status(400).json({
          success: false,
          message: "Ehtimol, siz ba'zi maydonlarni o'tkazib yuborgansiz!",
        });
      }
      const avatar = gravatar.url(contactNumber, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      var length = 7,
        charset = "0123456789",
        login = "";
      for (var i = 0, n = charset.length; i < length; ++i) {
        login += charset.charAt(Math.floor(Math.random() * n));
      }
      let hashedPassword;
      hashedPassword = await bcrypt.hash(dob, 10);
      var date = new Date();
      const joiningYear = date.getFullYear();
      var components = ["NWS", login];

      var registrationNumber = components.join("");
      const newsAdmin = await new Newsadmin({
        name,
        email,
        dob,
        password: hashedPassword,
        joiningYear,
        registrationNumber,
        avatar,
        contactNumber,
      });
      await newsAdmin.save();
      return res.status(200).json({
        success: true,
        message: "News Admin registerd successfully",
        response: newsAdmin,
      });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },
  addAdmin: async (req, res, next) => {
    try {
      const { name, email, dob, department, contactNumber, parol } = req.body;

      //VALIDATE REQUEST BODY
      if (!name || !email || !dob || !department || !contactNumber || !parol) {
        return res.status(400).json({
          success: false,
          message: "Ehtimol, siz ba'zi maydonlarni o'tkazib yuborgansiz!",
        });
      }

      const admin = await Admin.findOne({ email });
      if (admin) {
        return res.status(400).json({
          success: false,
          message: "Email allaqachon mavjud!",
        });
      }

      const avatar = gravatar.url(email, { s: "200", r: "pg", d: "mm" });
      let departmentHelper;
      if (department === "B.Sc") {
        departmentHelper = "01";
      } else if (department === "B.Tech") {
        departmentHelper = "02";
      } else if (department === "BAA") {
        departmentHelper = "03";
      } else {
        departmentHelper = "04";
      }

      const admins = await Admin.find({ department });
      let helper;
      if (admins.length < 10) {
        helper = "00" + admins.length.toString();
      } else if (admins.length < 100 && admins.length > 9) {
        helper = "0" + admins.length.toString();
      } else {
        helper = admins.length.toString();
      }
      let hashedPassword;
      hashedPassword = await bcrypt.hash(parol, 10);
      var date = new Date();
      const joiningYear = date.getFullYear();
      var components = ["ADM", date.getFullYear(), departmentHelper, helper];

      var registrationNumber = components.join("");
      const newAdmin = await new Admin({
        name,
        email,
        password: hashedPassword,
        joiningYear,
        registrationNumber,
        department,
        avatar,
        contactNumber,
        dob,
      });
      await newAdmin.save();
      return res.status(200).json({
        success: true,
        message: "Admin registerd successfully",
        response: newAdmin,
      });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },
  updateImage: async (req, res, next) => {
    try {
      const userPostImg = await bufferConversion(
        req.file.originalname,
        req.file.buffer
      );
      const imgResponse = await cloudinary.uploader.upload(userPostImg);

      const data = await Admin.findOneAndUpdate(
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
  getNewsAdmin: async (req, res) => {
    try {
      const dekans = await Newsadmin.find({});
      if (dekans.length === 0) {
        error = "News Admini Mavjud emas!";
        return res.status(400).json(error);
      }
      res.status(200).json(dekans);
    } catch (err) {
      console.log("Error in gettting all faculties", err.message);
    }
  },
  getDekans: async (req, res) => {
    try {
      const dekans = await Dekan.find({});
      if (dekans.length === 0) {
        error = "Fakultetlar Mavjud emas!";
        return res.status(400).json(error);
      }
      res.status(200).json(dekans);
    } catch (err) {
      console.log("Error in gettting all faculties", err.message);
    }
  },
  getNewsDetail: async (req, res, next) => {
    try {
      const data = await Newsadmin.findOne({ _id: req.params.id });
      res.status(200).json(data);
    } catch (err) {
      console.log("Error in updating Profile", err.message);
    }
  },
  getDekanDetail: async (req, res, next) => {
    try {
      const data = await Dekan.findOne({ registrationNumber: req.params.id });
      res.status(200).json(data);
    } catch (err) {
      console.log("Error in updating Profile", err.message);
    }
  },
  getFacultyDetail: async (req, res, next) => {
    console.log(req.params);
    try {
      const data = await Faculty.findOne({ registrationNumber: req.params.id });
      res.status(200).json(data);
    } catch (err) {
      console.log("Error in updating Profile", err.message);
    }
  },
  deleteNewsAdmin: async (req, res) => {
    try {
      const { _id } = req.body;
      const deleteduser = await Newsadmin.deleteOne({ _id: _id });
      res.status(200).json(deleteduser);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  deleteFaculty: async (req, res) => {
    try {
      const { registrationNumber } = req.body;
      const filter = await Faculty.findOne({ registrationNumber });
      const deleteduser = await Faculty.deleteOne({ _id: filter._id });
      res.status(200).json(deleteduser);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  updateNewsAdmin: async (req, res, next) => {
    const { errors, isValid } = validateStudentUpdate(req.body);
    try {
      if (!isValid) {
        res.status(404).json(errors);
      } else {
        delete req.body._id;
        const data = await Newsadmin.findOneAndUpdate(
          { _id: req.params.id },
          req.body,
          { new: true }
        );

        res.status(200).json({ message: "Dekan updated successfully", data });
      }
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: "Server error" });
    }
  },
  deleteDekan: async (req, res) => {
    try {
      const { registrationNumber } = req.body;
      const filter = await Dekan.findOne({ registrationNumber });
      const deleteduser = await Dekan.deleteOne({ _id: filter._id });
      res.status(200).json(deleteduser);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  updateFaculty: async (req, res, next) => {
    try {
      const { registrationNumber } = req.body;
      const data = await Faculty.findOneAndUpdate(
        { registrationNumber: registrationNumber },
        req.body,
        {
          new: true,
        }
      );

      res.status(200).json({ message: "Dekan updated successfully", data });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: "Server error" });
    }
  },
  updateDekans: async (req, res, next) => {
    try {
      const { registrationNumber } = req.body;
      const data = await Dekan.findOneAndUpdate(
        { registrationNumber: registrationNumber },
        req.body,
        {
          new: true,
        }
      );

      res.status(200).json({ message: "Dekan updated successfully", data });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: "Server error" });
    }
  },
  findAllStudent: async (req, res) => {
    console.log(req.body);
    console.log("salom");
    try {
      const search = req.query.search || "";
      const section = req.query.section || "";
      let Year = req.query.year || 0;
      let Department = req.query.department || "All";
      const genreCours = [1, 2, 3, 4];
      const genreOptions = ["B.Tech", "B.Sc", "BAA"];
      Year === 0
        ? (Year = [...genreCours])
        : (Year = req.query.year.split(","));

      Department === "All"
        ? (Department = [...genreOptions])
        : (Department = req.query.department.split(","));

      const students = await Student.find({
        name: { $regex: search, $options: "i" },
        section: { $regex: section, $options: "i" },
      })
        .where("year")
        .in([...Year])
        .where("department")
        .in([...Department]);

      const studentId = students.map((i) => i._id);
      const checkAttendence = await attendence
        .find({
          student: studentId,
        })
        .populate("subject")
        .populate("student");

      if (!checkAttendence) {
        res.status(400).json({ message: "Attendence not found" });
      }

      const Attendence = checkAttendence.map((att) => ({
        attendence: (
          (att.lectureAttended / att.totalLecturesByFaculty) *
          100
        ).toFixed(2),
        _id: att._id,
        subjectName: att.subject.subjectName,
        maxHours: att.subject.totalLectures,
        absentHours: att.totalLecturesByFaculty - att.lectureAttended,
        lectureAttended: att.lectureAttended,
        totalLecturesByFaculty: att.totalLecturesByFaculty,
        student: att.student,
        status: att.status,
      }));

      const attendanceByStudent = Attendence.reduce((acc, attendance) => {
        const { student } = attendance;
        if (!acc[student._id]) {
          acc[student._id] = {
            student,
            attendances: [],
            totalLectureAttended: 0,
            totalLectures: 0,
            totalAbsentHours: 0,
            totalMaxHours: 0,
          };
        }
        acc[student._id].attendances.push(attendance);
        acc[student._id].totalLectureAttended += attendance.lectureAttended;
        acc[student._id].totalLectures += attendance.totalLecturesByFaculty;
        acc[student._id].totalAbsentHours += attendance.absentHours;
        acc[student._id].totalMaxHours += attendance.maxHours;
        return acc;
      }, {});

      const attendanceArray = Object.values(attendanceByStudent);
      // console.log(attendanceArray);

      const total = await Student.countDocuments({
        department: { $in: [...Department] },
        year: { $in: [...Year] },
        section: { $regex: section, $options: "i" },
        name: { $regex: search, $options: "i" },
      });
      const response = {
        error: false,
        total,
        years: genreCours,
        departments: genreOptions,
        students,
        attendanceArray,
      };
      res.status(200).json(response);

      // const chekSms = attendanceArray.filter((i) => i.totalAbsentHours === 38);

      // var data = new FormData();
      // data.append("email", process.env.ESKIZ_EMAIL);
      // data.append("password", process.env.ESKIZ_SECRET);

      // var config = {
      // 	method: "post",
      // 	maxBodyLength: Infinity,
      // 	url: "https://notify.eskiz.uz/api/auth/login",
      // 	headers: {
      // 		...data.getHeaders(),
      // 	},
      // 	data: data,
      // };
      // let smsSent = false;
      // const Chek = chekSms.flatMap((item) => item.attendances);
      // if (chekSms.length <= 0) {
      // 	console.log("length 0");
      // res.status(200).json(response);
      // } else {
      // 	const ff = Chek.map((i) => i.status === true);
      // 	if (!smsSent && ff[0] === true) {
      // 		axios(config)
      // 			.then(function (response) {
      // 				// let smsSent = false; // flag to keep track of whether the SMS has been sent
      // 				smsSent = true; // set the flag to true once the SMS has been sent

      // 				const token = response.data.data.token;
      // 				console.log(token);
      // 				const jsonResponse = JSON.parse(JSON.stringify(response));
      // 				res.status(200).json(jsonResponse);

      // 				// // Set the request headers
      // 				// const headers = {
      // 				// 	Authorization: "Bearer " + token,
      // 				// 	Accept: "*/*",
      // 				// 	Connection: "keep-alive",
      // 				// };
      // 				// var data = new FormData();
      // 				// data.append("mobile_phone", "998999576266"); // Chek[0].student.studentMobileNumber
      // 				// data.append(
      // 				// 	"message",
      // 				// 	`${Chek[0].student.name} siz 30 soat dars qoldirdingiz!`
      // 				// );
      // 				// data.append("from", "4546");
      // 				// data.append(
      // 				// 	"callback_url",
      // 				// 	"http://localhost:5000/api/admin/findAllStudent"
      // 				// );
      // 				// var config = {
      // 				// 	method: "post",
      // 				// 	maxBodyLength: Infinity,
      // 				// 	url: "https://notify.eskiz.uz/api/message/sms/send",
      // 				// 	headers: headers,
      // 				// 	data: data,
      // 				// };
      // 				// if (!smsSent) {
      // 				// 	// check if SMS has not been sent yet
      // 				// 	axios(config)
      // 				// 		.then(function (response) {
      // 				// 			// Convert the response to JSON
      // 				// 			const jsonResponse = JSON.parse(JSON.stringify(response));
      // 				// 			res.status(200).json(jsonResponse);
      // 				// 			smsSent = true; // set the flag to true after sending the SMS
      // 				// 			console.log("okkkk");
      // 				// 		})
      // 				// 		.catch(function (error) {
      // 				// 			smsSent = true; // set the flag to true after sending the SMS
      // 				// 			console.log(error.message);
      // 				// 			res.status(404).json(error.message);
      // 				// 		});
      // 				// } else {
      // 				// 	console.log("SMS already sent"); // output a message indicating that SMS has already been sent
      // 				// }
      // 			})
      // 			.catch(function (error) {
      // 				console.log(error);
      // 				res.status(200).json(response);
      // 			});
      // 	}
      // }
    } catch (error) {
      console.log(error.message);
    }
  },
  adminLogin: async (req, res, next) => {
    try {
      const { errors, isValid } = validateAdminLoginInput(req.body);
      // Check Validation
      if (!isValid) {
        return res.status(400).json(errors);
      }
      const { registrationNumber, password } = req.body;

      const admin = await Admin.findOne({ registrationNumber });
      if (!admin) {
        errors.registrationNumber = "Registration number not found!";
        return res.status(404).json(errors);
      }
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
          contactNumber: admin.contactNumber,
          avatar: admin.avatar,
          registrationNumber: admin.registrationNumber,
          joiningYear: admin.joiningYear,
          department: admin.department,
          showModal: false,
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
    } catch (err) {
      console.log("Error in admin login", err.message);
    }
  },
  addDekan: async (req, res, next) => {
    try {
      const { errors, isValid } = validateDekanRegisterInput(req.body);
      //Validation
      if (!isValid) {
        return res.status(400).json(errors);
      }
      const {
        name,
        firstNumber,
        department,
        email,
        secontNumber,
        dob,
        gender,
      } = req.body;

      const avatar = gravatar.url(name, {
        s: "200", // Size
        r: "pg", // Rating
        d: "mm", // Default
      });
      let departmentHelper;
      if (department === "B.Sc") {
        departmentHelper = "BSc";
      } else if (department === "B.Tech") {
        departmentHelper = "BTech";
      } else if (department === "BAA") {
        departmentHelper = "BAA";
      } else {
        departmentHelper = "04";
      }

      const faculties = await Dekan.find({ department });
      let helper;
      if (faculties.length < 10) {
        helper = "00" + faculties.length.toString();
      } else if (faculties.length < 100 && faculties.length > 9) {
        helper = "0" + faculties.length.toString();
      } else {
        helper = faculties.length.toString();
      }
      let hashedPassword;
      hashedPassword = await bcrypt.hash(dob, 10);
      var date = new Date();
      const joiningYear = date.getFullYear();
      function generateNum() {
        var digits = "0123456789";
        let OTP = "";
        for (let i = 0; i < 3; i++) {
          OTP += digits[Math.floor(Math.random() * 10)];
        }
        return OTP;
      }
      const code = await generateNum();
      var components = [date.getFullYear(), departmentHelper, helper, code];

      var registrationNumber = components.join("");
      const newDekan = await new Dekan({
        name,
        firstNumber,
        password: hashedPassword,
        department,
        secontNumber,
        gender,
        email,
        avatar,
        registrationNumber,
        dob,
        joiningYear,
      });
      await newDekan.save();
      return res.status(200).json({
        success: true,
        message: "Dekan registerd successfully",
        result: newDekan,
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: `error in adding new Dekan", ${err.message}`,
      });
    }
  },
  addFaculty: async (req, res, next) => {
    try {
      const { errors, isValid } = validateFacultyRegisterInput(req.body);
      //Validation
      if (!isValid) {
        return res.status(400).json(errors);
      }
      const {
        name,
        email,
        department,
        facultyMobileNumber,
        aadharCard,
        dob,
        gender,
      } = req.body;
      const avatar = gravatar.url(department, {
        s: "200", // Size
        r: "pg", // Rating
        d: "mm", // Default
      });
      let departmentHelper;
      if (department === "B.Sc") {
        departmentHelper = "01";
      } else if (department === "B.Tech") {
        departmentHelper = "02";
      } else if (department === "BAA") {
        departmentHelper = "03";
      } else {
        departmentHelper = "04";
      }

      const faculties = await Faculty.find({ department });
      let helper;
      if (faculties.length < 10) {
        helper = "00" + faculties.length.toString();
      } else if (faculties.length < 100 && faculties.length > 9) {
        helper = "0" + faculties.length.toString();
      } else {
        helper = faculties.length.toString();
      }
      let hashedPassword;
      hashedPassword = await bcrypt.hash(dob, 10);
      var date = new Date();
      function generateNum() {
        var digits = "0123456789";
        let OTP = "";
        for (let i = 0; i < 4; i++) {
          OTP += digits[Math.floor(Math.random() * 10)];
        }
        return OTP;
      }
      const code = await generateNum();
      const joiningYear = date.getFullYear();
      var components = ["FAC", code, departmentHelper, helper];

      var registrationNumber = components.join("");
      const newFaculty = await new Faculty({
        name,
        email,
        password: hashedPassword,
        department,
        facultyMobileNumber,
        gender,
        avatar,
        aadharCard,
        registrationNumber,
        dob,
        joiningYear,
      });
      await newFaculty.save();
      res.status(200).json({ result: newFaculty });
    } catch (err) {
      console.log("error", err.message);
      res
        .status(400)
        .json({ message: `error in adding new Faculty", ${err.message}` });
    }
  },
  getAllFaculty: async (req, res, next) => {
    try {
      const result = await Faculty.find({});

      res.status(200).json(result);
    } catch (err) {
      console.log("Error in gettting all faculties", err.message);
    }
  },
  addSubject: async (req, res, next) => {
    try {
      const { errors, isValid } = validateSubjectRegisterInput(req.body);
      //Validation
      // console.log(req.user);
      if (!isValid) {
        return res.status(400).json(errors);
      }
      const { totalLectures, department, subjectCode, subjectName, year } =
        req.body;
      const subject = await Subject.findOne({ subjectCode });
      if (subject) {
        errors.subjectCode = "Fan qo'shildi";
        return res.status(400).json(errors);
      }
      const newSubject = await new Subject({
        totalLectures,
        department,
        subjectCode,
        subjectName,
        year,
      });
      await newSubject.save();
      const students = await Student.find({ department, year });
      if (students.length === 0) {
        errors.department = "Fan topilmadi";
        return res.status(400).json(errors);
      } else {
        for (var i = 0; i < students.length; i++) {
          students[i].subjects.push(newSubject._id);
          await students[i].save();
        }
        res.status(200).json({ newSubject });
      }
    } catch (err) {
      console.log(`error in adding new subject", ${err.message}`);
    }
  },
  getAllSubject: async (req, res, next) => {
    try {
      const { errors, isValid } = validateGetAllSubject(req.body);

      if (!isValid) {
        return res.status(400).json(errors);
      }
      const { department, year } = req.body;
      const Department = await Subject.exists({ department });
      if (!Department) {
        errors.department = "Faculty topilmadi!";
        return res.status(404).json(errors);
      }

      const Kurs = await Subject.exists({ department, year });
      if (!Kurs) {
        errors.year = "Cours not found";
        return res.status(404).json(errors);
      }
      const allSubjects = await Subject.find({ department, year });
      res.status(200).json({ result: allSubjects });
    } catch (err) {
      console.log("Error in gettting all Subjects", err.message);
    }
  },
  checkAttendence: async (req, res, next) => {
    try {
      const studentId = req.user._id;
      // console.log(req.user);
      const checkAttendence = await attendence
        .find({
          student: studentId,
        })
        .populate("subject");

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
