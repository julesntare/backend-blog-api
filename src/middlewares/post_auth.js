const mongoose = require('mongoose');
import users from '../models/users.models';
import posts from '../models/posts.models';
import jwt from 'jsonwebtoken';

const key = process.env.SECRET_KEY;

const verifyPostAccess = async (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		const decode = jwt.verify(token, key);
		const post = await posts.findOne({ _id: req.params.id });
		const user = await users.findOne({ email: post.author });
		if (decode.email != user.email || user.level != 1) {
			return res.status(401).json({ message: 'This is not your post' });
		}
		next();
	} catch (error) {
		res.status(401).json({ message: 'Authentication failed!' });
	}
};

export default verifyPostAccess;
