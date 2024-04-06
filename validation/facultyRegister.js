const Validator = require("validator");
const isEmpty = require("./is-empty");

const validateFacultyRegisterInput = (data) => {
	let errors = {};
	data.name = !isEmpty(data.name) ? data.name : "";
	data.department = !isEmpty(data.department) ? data.department : "";
	data.dob = !isEmpty(data.dob) ? data.dob : "";

	if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
		errors.name = "Full name must be between 2 and 30 characters";
	}

	if (Validator.isEmpty(data.name)) {
		errors.name = "Full namespace is required!";
	}

	if (Validator.isEmpty(data.department)) {
		errors.department = "Faculty is required!";
	}

	if (Validator.isEmpty(data.dob)) {
		errors.dob = "Date of birth required!!";
	}

	return {
		errors,
		isValid: isEmpty(errors),
	};
};

module.exports = validateFacultyRegisterInput;
