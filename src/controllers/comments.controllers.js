import comments from '../models/comments.models';
import dotenv from 'dotenv';
import {} from 'dotenv/config';

dotenv.config();

// Comments controllers
const addComment = (req, res) => {
	let id = req.params.id;
	let newComment = {};
	newComment.author = req.body.author;
	newComment.desc = req.body.desc;
	newComment.postId = id;
	if (Object.keys(req.body).length === 0) {
		return res.status(409).json({ msg: 'provide data' });
	}
	const comment = new comments(newComment);
	comment.save().then((data) => {
		res.status(200).json({ msg: 'Comment Added Successfully', data });
	});
};

const getComments = (req, res) => {
	let id = req.params.id;
	comments.find({ postId: id }).then((result) => {
		res.status(200).json(result);
	});
};

const getCommentById = (req, res) => {
	let cid = req.params.cid;
	let id = req.params.id;
	comments
		.findOne({ _id: cid, postId: id })
		.then((result) => {
			res.status(200).json(result);
		})
		.catch((err) => {
			res.status(404).json({ msg: 'not found' });
		});
};

const deleteComment = (req, res) => {
	let cid = req.params.cid;
	comments
		.findByIdAndDelete(cid)
		.then(() => {
			res.status(204).send();
		})
		.catch((err) => {
			res.status(404).json({ msg: 'comment not deleted' });
		});
};

const updateComment = async (req, res) => {
	let cid = req.params.cid;
	if (Object.keys(req.body).length == 0) {
		return res.status(409).json({ msg: 'provide comment' });
	}
	comments
		.findByIdAndUpdate(cid, { ...req.body })
		.then((result) => {
			res.status(200).json({ msg: 'comment updated' });
		})
		.catch((err) => {
			res.status(404).json({ msg: 'Comment not updated' });
		});
};

module.exports = {
	addComment,
	getComments,
	getCommentById,
	deleteComment,
	updateComment,
};
