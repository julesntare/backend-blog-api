const mongoose = require('mongoose');

const schema = mongoose.Schema({
	author: String,
	title: String,
	desc: String,
	'cover-imgUrl': String,
	likes: Number,
	comments: [{ author: String, desc: String, 'replied-at': { type: Date, default: new Date() } }],
	state: String,
	'created-at': { type: Date, default: new Date() },
});

module.exports = mongoose.model('Post', schema);
