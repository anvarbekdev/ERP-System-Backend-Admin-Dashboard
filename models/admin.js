const mongoose = require("mongoose");
const { Schema } = mongoose;

const adminSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
	},
	registrationNumber: {
		type: String,
	},
	dob: {
		type: String,
	},
	joiningYear: {
		type: String,
	},
	avatar: {
		type: String,
	},
	contactNumber: {
		type: Number,
	},
	otp: {
		type: String,
	},
});

module.exports = mongoose.model("admin", adminSchema);
