const Validator = require("validator");
const isEmpty = require("./is-empty");

const validateNewsRegisterInput = (data) => {
	let errors = {};
	data.title = !isEmpty(data.title) ? data.title : "";
	data.desc = !isEmpty(data.desc) ? data.desc : "";
	data.muallif = !isEmpty(data.muallif) ? data.muallif : "";
	data.uploadtime = !isEmpty(data.uploadtime) ? data.uploadtime : "";

	if (!Validator.isLength(data.title, { min: 2, max: 50 })) {
		errors.title = "Title must be between 2 and 50 characters";
	}

	if (Validator.isEmpty(data.title)) {
		errors.title = "Title is required!";
	}

	if (!Validator.isEmail(data.email)) {
		errors.desc = "Title is invalid";
	}

	if (Validator.isEmpty(data.desc)) {
		errors.desc = "Email is required!";
	}

	if (Validator.isEmpty(data.muallif)) {
		errors.muallif = "Author field is required";
	}

	if (Validator.isEmpty(data.uploadtime)) {
		errors.uploadtime = "Upload time field is required";
	}

	return {
		errors,
		isValid: isEmpty(errors),
	};
};

module.exports = validateNewsRegisterInput;
