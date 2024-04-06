const Validator = require("validator");
const isEmpty = require("./is-empty");

const validateFacultyUploadMarks = (data) => {
	let errors = {};
	data.subjectName = !isEmpty(data.subjectName) ? data.subjectName : "";

	if (Validator.isEmpty(data.subjectName)) {
		errors.subjectName = "Subject is required!";
	}
	return {
		errors,
		isValid: isEmpty(errors),
	};
};

module.exports = validateFacultyUploadMarks;
