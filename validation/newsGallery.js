const Validator = require("validator");
const isEmpty = require("./is-empty");

const validateGalleryLoginInput = (data) => {
	let errors = {};
	data.title = !isEmpty(data.title) ? data.title : "";

	if (Validator.isEmpty(data.title)) {
		errors.title = "Title is required!";
	}
	return {
		errors,
		isValid: isEmpty(errors),
	};
};

module.exports = validateGalleryLoginInput;
