const mongoose = require('mongoose');
import users from '../models/users.models';
import posts from '../models/posts.models';

const verifyCommentAccess = async (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		const decode = jwt.verify(token, key);
		posts
			.findOne({ _id: req.params.id })
			.then(async (result) => {
				let com = await result.comments.find((comment) => comment._id == req.params.cid);
				const user = await users.findOne({
					firstname: com.author.split(' ')[0],
					lastname: com.author.split(' ')[1],
				});
				if (decode.email != user.email || user.level != 1) {
					return res.status(401).json({ message: 'This is not your comment' });
				}
				next();
			})
			.catch((err) => {
				res.status(404).json({ msg: 'Comment not found' });
			});
	} catch (error) {
		res.status(401).json({ message: 'Authentication failed!' });
	}
};

export default verifyCommentAccess;
