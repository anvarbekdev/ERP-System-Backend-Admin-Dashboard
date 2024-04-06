const Validator = require("validator");
const isEmpty = require("./is-empty");

const validateDekanUploadMarks = (data) => {
	let errors = {};
	data.subjectName = !isEmpty(data.subjectName) ? data.subjectName : "";
	data.exam = !isEmpty(data.exam) ? data.exam : "";
	data.totalMarks = !isEmpty(data.totalMarks) ? data.totalMarks : "";

	if (Validator.isEmpty(data.subjectName)) {
		errors.subjectName = "Subject is required!";
	}

	if (Validator.isEmpty(data.exam)) {
		errors.exam = "Exam  is required!";
	}

	if (Validator.isEmpty(data.totalMarks)) {
		errors.totalMarks = "Total marks  is required!";
	}

	return {
		errors,
		isValid: isEmpty(errors),
	};
};

module.exports = validateDekanUploadMarks;
