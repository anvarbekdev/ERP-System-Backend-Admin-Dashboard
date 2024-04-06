const mongoose = require("mongoose");
const { Schema } = mongoose;

const gallerySchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	image: {
		type: String,
	},
	uploadtime: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model("gallery", gallerySchema);
