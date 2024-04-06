const Validator = require("validator");
const isEmpty = require("./is-empty");

const validateUpdatePassword = (data) => {
	let errors = {};
	data.oldPassword = !isEmpty(data.oldPassword) ? data.oldPassword : "";
	data.newPassword = !isEmpty(data.newPassword) ? data.newPassword : "";
	data.confirmNewPassword = !isEmpty(data.confirmNewPassword)
		? data.confirmNewPassword
		: "";

	if (data.newPassword !== data.confirmNewPassword) {
		errors.confirmNewPassword = "Password is mismatch";
	}

	if (Validator.isEmpty(data.confirmNewPassword)) {
		errors.confirmNewPassword = "New password field is required";
	}

	if (Validator.isEmpty(data.oldPassword)) {
		errors.oldPassword = "Old Password is required!";
	}

	if (!Validator.isLength(data.newPassword, { min: 6, max: 30 })) {
		errors.newPassword = "Password must be at least 6 digits long!";
	}

	if (Validator.isEmpty(data.newPassword)) {
		errors.newPassword = "New password field is required";
	}

	return {
		errors,
		isValid: isEmpty(errors),
	};
};

module.exports = validateUpdatePassword;
