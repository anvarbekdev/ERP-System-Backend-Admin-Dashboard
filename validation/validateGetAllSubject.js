const Validator = require("validator");
const isEmpty = require("./is-empty");

const validateGetAllSubject = (data) => {
	let errors = {};
	data.department = !isEmpty(data.department) ? data.department : "";
	data.year = !isEmpty(data.year) ? data.year : "";
	if (Validator.isEmpty(data.department)) {
		errors.department = "Faculty is required!";
	}

	if (Validator.isEmpty(data.year)) {
		errors.year = "Cours is required!!";
	}
	return {
		errors,
		isValid: isEmpty(errors),
	};
};

module.exports = validateGetAllSubject;
