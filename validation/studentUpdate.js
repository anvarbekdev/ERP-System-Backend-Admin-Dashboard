const Validator = require("validator");
const isEmpty = require("./is-empty");

const validateStudentUpdate = (data) => {
	let errors = {};
	data.registrationNumber = !isEmpty(data.registrationNumber)
		? data.registrationNumber
		: "";

	if (!Validator.isLength(data.registrationNumber, { min: 2, max: 20 })) {
		errors.registrationNumber = "Reg Num must be between 2 and 20 characters!";
	}

	if (Validator.isEmpty(data.registrationNumber)) {
		errors.registrationNumber = "Reg Num is required!";
	}

	return {
		errors,
		isValid: isEmpty(errors),
	};
};

module.exports = validateStudentUpdate;
