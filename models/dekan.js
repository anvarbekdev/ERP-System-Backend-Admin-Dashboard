const mongoose = require("mongoose");
const { Schema } = mongoose;

const dekanSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
	},
	avatar: {
		type: String,
	},
	password: {
		type: String,
	},
	registrationNumber: {
		type: String,
	},
	gender: {
		type: String,
	},
	department: {
		type: String,
		required: true,
	},
	firstNumber: {
		type: Number,
	},
	secontNumber: {
		type: Number,
	},
	dob: {
		type: String,
		required: true,
	},
	joiningYear: {
		type: Number,
		required: true,
	},
});

module.exports = mongoose.model("dekan", dekanSchema);
