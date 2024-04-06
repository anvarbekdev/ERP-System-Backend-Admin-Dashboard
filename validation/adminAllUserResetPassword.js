const Validator = require("validator");
const isEmpty = require("./is-empty");

const AdminAllResetPassword = (data) => {
	let errors = {};
	data.dob = !isEmpty(data.dob) ? data.dob : "";

	if (Validator.isEmpty(data.dob)) {
		errors.dob = "Login field is required";
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

module.exports = AdminAllResetPassword;
