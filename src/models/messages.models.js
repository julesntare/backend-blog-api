const mongoose = require('mongoose');

const schema = mongoose.Schema({
	name: String,
	email: String,
	msg: String,
	date: { type: Date, default: new Date() },
});

module.exports = mongoose.model('Message', schema);
