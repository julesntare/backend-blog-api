const mongoose = require('mongoose');
import users from '../models/users.models';
import posts from '../models/posts.models';

const verifyPostAccess = async (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		const decode = jwt.verify(token, key);
		const post = await posts.findOne({ _id: req.params.id });
		const user = await users.findOne({ firstname: post.author.split(' ')[0], lastname: post.author.split(' ')[1] });
		if (decode.email != user.email || user.level != 1) {
			return res.status(401).json({ message: 'This is not your post' });
		}
		next();
	} catch (error) {
		res.status(401).json({ message: 'Authentication failed!' });
	}
};

export default verifyPostAccess;
