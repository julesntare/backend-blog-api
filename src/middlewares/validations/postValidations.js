const mongoose = require('mongoose');
import users from '../../models/users.models';

const postAddValidations = async (req, res, next) => {
	let userData = await users.findOne({
		email: req.body.author,
	});
	if (req.body.author == undefined || req.body.title == undefined) {
		return res.status(400).json({ msg: 'Please provide at least author and title' });
	}
	if (!/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(req.body.author)) {
		return res.status(400).json({ msg: 'author must not be empty, must be email, and have above 3 letters' });
	}
	if (req.body.title.length < 3 || req.body.title == '' || typeof req.body.title != 'string') {
		return res.status(400).json({ msg: 'title must not be empty, be string and have above 3 letters' });
	}
	if (userData == null) {
		return res.status(400).json({ msg: 'Author not available in system' });
	}
	if (req.body.desc) {
		if (req.body.desc == '' || typeof req.body.desc != 'string') {
			return res.status(400).json({ msg: 'desc must not be empty' });
		}
	}
	if (req.body.state) {
		if (typeof req.body.state != 'string' || req.body.state != 'draft') {
			return res.status(400).json({ msg: 'state must be string and have to be "published" or "draft"' });
		}
	}
	next();
};

const postEditValidations = async (req, res, next) => {
	if (Object.keys(req.body).length == 0) {
		return res.status(409).json({ msg: 'please provide data' });
	}
	if (req.body.author) {
		if (!/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(req.body.author)) {
			return res.status(400).json({ msg: 'author must not be empty, must be email, and have above 3 letters' });
		}
	}
	if (req.body.title) {
		if (req.body.title.length < 3 || req.body.title == '' || typeof req.body.title != 'string') {
			return res.status(400).json({ msg: 'title must not be empty, be string and have above 3 letters' });
		}
	}
	if (req.body.desc) {
		if (req.body.desc == '' || typeof req.body.desc != 'string') {
			return res.status(400).json({ msg: 'desc must not be empty' });
		}
	}
	if (req.body.state) {
		if (req.body.state != 'published' || req.body.state != 'draft' || typeof req.body.state != 'string') {
			return res.status(400).json({ msg: 'state must be string and have to be "published" or "draft"' });
		}
	}
	next();
};

export default { postAddValidations, postEditValidations };
