const Validator = require("validator");
const isEmpty = require("./is-empty");

const validateAdminLoginInput = (data) => {
	let errors = {};
	data.registrationNumber = !isEmpty(data.registrationNumber)
		? data.registrationNumber
		: "";
	data.password = !isEmpty(data.password) ? data.password : "";

	if (!Validator.isLength(data.registrationNumber, { min: 7, max: 13 })) {
		errors.registrationNumber = "The entry must be at least 7 characters long";
	}

	if (Validator.isEmpty(data.registrationNumber)) {
		errors.registrationNumber = "Login field is required!";
	}

	if (Validator.isEmpty(data.password)) {
		errors.password = "Password field is required";
	}

	return {
		errors,
		isValid: isEmpty(errors),
	};
};

module.exports = validateAdminLoginInput;
