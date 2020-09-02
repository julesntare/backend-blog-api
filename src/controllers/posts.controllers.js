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

// Posts controllers
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
				return res.status(400).json({ msg: 'error updating' });
			}
			res.status(200).json({ msg: 'post updated' });
		});
	}
};

module.exports = {
	getAllPosts,
	getPostById,
	createPost,
	deletePost,
	updatePostInfo,
};
