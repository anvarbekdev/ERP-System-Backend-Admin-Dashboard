const Validator = require("validator");
const isEmpty = require("./is-empty");

const validateStudentRegisterInput = (data) => {
	let errors = {};
	data.registrationNumber = !isEmpty(data.registrationNumber)
		? data.registrationNumber
		: "";
	data.department = !isEmpty(data.department) ? data.department : "";
	data.section = !isEmpty(data.section) ? data.section : "";
	data.dob = !isEmpty(data.dob) ? data.dob : "";
	data.year = !isEmpty(data.year) ? data.year : "";

	if (!Validator.isLength(data.registrationNumber, { min: 2, max: 20 })) {
		errors.registrationNumber = "Reg Num must be between 2 and 20 characters";
	}

	if (Validator.isEmpty(data.registrationNumber)) {
		errors.registrationNumber = "Reg Num is required!";
	}

	if (Validator.isEmpty(data.department)) {
		errors.department = "Faculty is required!";
	}

	if (Validator.isEmpty(data.year)) {
		errors.year = "Cours is required!!";
	}

	if (Validator.isEmpty(data.section)) {
		errors.section = "Group is required!";
	}

	if (Validator.isEmpty(data.dob)) {
		errors.dob = "Date of birth required!";
	}

	return {
		errors,
		isValid: isEmpty(errors),
	};
};

module.exports = validateStudentRegisterInput;
