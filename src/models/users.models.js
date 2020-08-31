const mongoose = require('mongoose');

const schema = mongoose.Schema({
	firstname: String,
	lastname: String,
	email: String,
	'profile-img-url': String,
	password: String,
	comments: Array,
	state: String,
	location: String,
	bio: String,
	noOfEntries: Number,
	level: Number,
	joined: { type: Date, default: new Date() },
});

module.exports = mongoose.model('User', schema);
