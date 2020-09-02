const mongoose = require('mongoose');

const schema = mongoose.Schema({
	postId: String,
	author: String,
	desc: String,
	'replied-at': { type: Date, default: new Date() },
});

module.exports = mongoose.model('Comment', schema);
