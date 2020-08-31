import posts from '../models/posts.models';
import dotenv from 'dotenv';
import {} from 'dotenv/config';
const cloudinary = require('cloudinary').v2;

dotenv.config();
cloudinary.config({
	cloud_name: 'julesntare',
	api_key: process.env.cloudinary_API_KEY,
	api_secret: process.env.cloudinary_API_SECRET,
});

const getAllPosts = async (req, res) => {
	const postData = await posts.find();
	res.status(200).json(postData);
};

const getPostById = (req, res) => {
	let id = req.params.id;
	posts
		.findById(id)
		.then((result) => {
			res.status(200).json(result);
		})
		.catch((err) => {
			res.status(404).json({ msg: 'post not found' });
		});
};

const createPost = async (req, res) => {
	let newPost = {};
	newPost['author'] = req.body.author;
	newPost['title'] = req.body.title;
	newPost['desc'] = req.body.desc;
	newPost['likes'] = 0;
	newPost['comments'] = [];
	newPost['state'] = req.body.state != undefined ? req.body.state : 'published';

	if (req.file) {
		const path = req.file.path;
		cloudinary.uploader.upload(path, (err, image) => {
			if (err) return res.send(err);
			const fs = require('fs');
			fs.unlinkSync(path);
			if (image) {
				newPost['cover-imgUrl'] = image.url;
				const post = new posts(newPost);
				post.save();
				res.status(201).json({ msg: 'post created' });
			}
		});
	} else {
		newPost['cover-imgUrl'] = null;
		const post = new posts(newPost);
		post.save().then((data) => {
			res.status(201).json({ msg: 'post created', data });
		});
	}
};

const deletePost = (req, res) => {
	let id = req.params.id;
	posts
		.deleteOne({ _id: id })
		.then((result) => {
			res.status(204).send();
		})
		.catch((err) => res.status(404).json({ msg: 'No post to delete' }));
};

const updatePostInfo = (req, res) => {
	let id = req.params.id;
	if (req.file) {
		const path = req.file.path;
		cloudinary.uploader.upload(path, (err, image) => {
			if (err) return res.send(err);
			const fs = require('fs');
			fs.unlinkSync(path);
			if (image) {
				posts.findByIdAndUpdate({ _id: id }, { ...req.body, [req.file.fieldname]: image.url }, (err, data) => {
					if (err) {
						return res.status(500).json({ msg: 'error updating' });
					}
					res.status(200).json({ msg: 'post updated' });
				});
			}
		});
	} else {
		posts.findByIdAndUpdate({ _id: id }, { ...req.body }, (err, data) => {
			if (err) {
				return res.status(403).json({ msg: 'error updating' });
			}
			res.status(200).json({ msg: 'post updated' });
		});
	}
};

const addComment = (req, res) => {
	let id = req.params.id;
	if (Object.keys(req.body).length === 0) {
		return res.status(500).json({ msg: 'provide data' });
	}
	posts
		.updateOne({ _id: id }, { $push: { comments: req.body } })
		.then((result) => {
			res.status(200).json({ msg: 'commented added' });
		})
		.catch((err) => {
			res.status(404).json({ msg: 'error adding comment' });
		});
};

const getComments = (req, res) => {
	let id = req.params.id;
	posts
		.findById(id)
		.then((result) => {
			res.status(200).json(result.comments);
		})
		.catch((err) => {
			res.status(404).json({ msg: 'error' });
		});
};

const getCommentById = (req, res) => {
	let id = req.params.id;
	let cid = req.params.cid;
	posts
		.findOne({ _id: id })
		.select({ comments: { $elemMatch: { _id: cid } } })
		.then((result) => {
			res.status(200).json(result.comments[0]);
		})
		.catch((err) => {
			res.status(404).json({ msg: 'not found' });
		});
};

const deleteComment = (req, res) => {
	let id = req.params.id;
	let cid = req.params.cid;
	posts
		.findByIdAndUpdate(id, { $pull: { comments: { _id: cid } } })
		.then((result) => {
			res.status(200).json({ msg: 'comment deleted' });
		})
		.catch((err) => {
			res.status(404).json({ msg: 'comment not deleted' });
		});
};

const updateComment = async (req, res) => {
	let id = req.params.id;
	let cid = req.params.cid;
	if (Object.keys(req.body).length == 0) {
		return res.status(404).json({ msg: 'provide comment' });
	}
	posts
		.findOne({ _id: id })
		.then((result) => {
			let com = result.comments.find((comment) => comment._id == cid);
			Object.assign(com, req.body);
			result.save().then(() => res.status(200).json({ msg: 'Comment updated' }));
		})
		.catch((err) => {
			res.status(404).json({ msg: 'Comment not updated' });
		});
};

module.exports = {
	getAllPosts,
	getPostById,
	createPost,
	deletePost,
	updatePostInfo,
	addComment,
	getComments,
	getCommentById,
	deleteComment,
	updateComment,
};
