const Validator = require("validator");
const isEmpty = require("./is-empty");

const myStudentRegister = (data) => {
	let errors = {};
	data.dob = !isEmpty(data.dob) ? data.dob : "";
	data.name = !isEmpty(data.name) ? data.name : "";

	if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
		errors.name = "Full name must be between 2 and 30 characters!";
	}

	if (Validator.isEmpty(data.name)) {
		errors.name = "Full name is required!";
	}

	if (Validator.isEmpty(data.dob)) {
		errors.dob = "Date of birth required!";
	}

	return {
		errors,
		isValid: isEmpty(errors),
	};
};

module.exports = myStudentRegister;
