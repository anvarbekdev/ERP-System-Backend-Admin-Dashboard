const mongoose = require("mongoose");
const { Schema } = mongoose;

const newsSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	image: {
		type: String,
	},
	desc: {
		type: String,
		required: true,
	},
	muallif: {
		type: String,
		required: true,
	},
	uploadtime: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model("news", newsSchema);
