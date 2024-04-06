const Validator = require("validator");
const isEmpty = require("./is-empty");

const validateNewsLoginInput = (data) => {
	let errors = {};
	data.title = !isEmpty(data.title) ? data.title : "";
	data.desc = !isEmpty(data.desc) ? data.desc : "";
	data.muallif = !isEmpty(data.muallif) ? data.muallif : "";

	if (Validator.isEmpty(data.title)) {
		errors.title = "Title is required!";
	}
	if (Validator.isEmpty(data.desc)) {
		errors.desc = "Description is required!";
	}

	if (Validator.isEmpty(data.muallif)) {
		errors.muallif = "Author field is required!";
	}

	return {
		errors,
		isValid: isEmpty(errors),
	};
};

module.exports = validateNewsLoginInput;
