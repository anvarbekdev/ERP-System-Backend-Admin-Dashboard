const Validator = require("validator");
const isEmpty = require("./is-empty");

const validateAdminRegisterInput = (data) => {
	let errors = {};
	data.name = !isEmpty(data.name) ? data.name : "";
	data.email = !isEmpty(data.email) ? data.email : "";
	data.department = !isEmpty(data.department) ? data.department : "";
	data.dob = !isEmpty(data.dob) ? data.dob : "";
	data.contactNumber = !isEmpty(data.contactNumber) ? data.contactNumber : "";
	if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
		errors.name = "Full name must be between 2 and 30 characters";
	}
	if (!Validator.isLength(data.contactNumber, { min: 15, max: 15 })) {
		errors.contactNumber = "Contact number must be 15 digits long";
	}
	if (Validator.isEmpty(data.name)) {
		errors.name = "Full namespace is required!";
	}
	if (!Validator.isEmail(data.email)) {
		errors.email = "Email is invalid!";
	}
	if (Validator.isEmpty(data.email)) {
		errors.email = "Email is required!";
	}
	if (Validator.isEmpty(data.department)) {
		errors.department = "Faculty is required!";
	}
	if (Validator.isEmpty(data.dob)) {
		errors.dob = "Date of birth required!!";
	}
	if (Validator.isEmpty(data.contactNumber)) {
		errors.contactNumber = "Contact number is required!!";
	}
	return {
		errors,
		isValid: isEmpty(errors),
	};
};

module.exports = validateAdminRegisterInput;
