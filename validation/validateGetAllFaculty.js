const Validator = require("validator");
const isEmpty = require("./is-empty");

const validateGetAllFaculty = (data) => {
	let errors = {};
	data.department = !isEmpty(data.department) ? data.department : "";
	if (Validator.isEmpty(data.department)) {
		errors.department = "Faculty is required!";
	}
	return {
		errors,
		isValid: isEmpty(errors),
	};
};

module.exports = validateGetAllFaculty;
