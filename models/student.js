const mongoose = require("mongoose");
const { Schema } = mongoose;

const studentSchema = new Schema({
	name: {
		type: String,
	},
	email: {
		type: String,
	},
	avatar: {
		type: String,
	},
	password: {
		type: String,
		required: true,
	},
	year: {
		type: Number,
		required: true,
	},
	subjects: [
		{
			type: Schema.Types.ObjectId,
			ref: "subject",
		},
	],
	fatherName: {
		type: String,
	},
	gender: {
		type: String,
	},
	registrationNumber: {
		type: String,
		required: true,
	},
	department: {
		type: String,
		required: true,
	},
	section: {
		type: String,
		required: true,
	},
	batch: {
		type: String,
	},
	dob: {
		type: String,
		required: true,
	},
	studentMobileNumber: {
		type: Number,
	},
	fatherMobileNumber: {
		type: Number,
	},
	fatherName: {
		type: String,
	},
	otp: {
		type: String,
	},
});

module.exports = mongoose.model("student", studentSchema);
