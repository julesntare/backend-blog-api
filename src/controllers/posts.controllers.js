import posts from '../models/posts.models';
import { v4 as uuidv4 } from 'uuid';
const cloudinary = require('cloudinary').v2;

cloudinary.config({
	cloud_name: 'julesntare',
	api_key: '658528737163627',
	api_secret: '_rLWat1SCgg0NMVSZ6myvZO99-Y',
});

const getAllPosts = (req, res) => {
	res.send(posts);
};

const getPostById = (req, res) => {
	let id = req.params.id;
	let post = posts.filter((post) => post.id === id);
	if (post.length === 0) {
		return res.status(404).json({ msg: 'post not found' });
	}
	res.send(post);
};

const createPost = (req, res) => {
	let newPost = {};
	newPost.id = uuidv4();
	newPost['author'] = req.body.author;
	newPost['title'] = req.body.title;
	newPost['desc'] = req.body.desc;
	newPost['likes'] = 0;
	newPost['comments'] = [];
	newPost['state'] = req.body.state != undefined ? req.body.state : 'published';
	newPost['created-at'] = new Date();

	if (Object.keys(req.body).length === 0) {
		return res.status(500).json({ msg: 'Provide some data' });
	}
	if (req.body.title == undefined || req.body.title == '') {
		return res.status(206).json({ msg: 'provide title' });
	}
	if (req.file) {
		const path = req.file.path;
		cloudinary.uploader.upload(path, (err, image) => {
			if (err) return res.send(err);
			const fs = require('fs');
			fs.unlinkSync(path);
			if (image) {
				newPost['cover-imgUrl'] = image.url;
				posts.push(newPost);
				res.send(posts);
			}
		});
	} else {
		newPost['cover-imgUrl'] = null;
		posts.push(newPost);
		res.send(posts);
	}
};

const deletePost = (req, res) => {
	let id = req.params.id;
	let found = posts.find((post) => post.id === id);
	if (found == undefined) {
		return res.status(404).json({ msg: 'no post to delete' });
	}
	posts.splice(posts.indexOf(found), 1);
	res.send(posts);
};

const updatePostInfo = (req, res) => {
	let id = req.params.id;
	let found = posts.find((post) => post.id === id);
	if (Object.keys(req.body).length === 0) {
		return res.status(500).json({ msg: 'Provide some data' });
	}
	if (found == undefined) {
		return res.status(404).json({ msg: 'no post to edit' });
	}
	if (req.file) {
		const path = req.file.path;
		cloudinary.uploader.upload(path, (err, image) => {
			if (err) return res.send(err);
			const fs = require('fs');
			fs.unlinkSync(path);
			if (image) {
				posts.splice(posts.indexOf(found), 1, { ...found, ...req.body, [req.file.fieldname]: image.url });
				res.status(200).json(posts);
			}
		});
	} else {
		posts.splice(posts.indexOf(found), 1, { ...found, ...req.body });
		res.status(200).json(posts);
	}
};

const addComment = (req, res) => {
	let id = req.params.id;
	let found = posts.find((post) => post.id === id);
	if (found == undefined) {
		return res.status(500).json({ msg: 'no post to comment' });
	}
	found.comments.unshift({
		id: uuidv4(),
		'replied-at': new Date(),
		...req.body,
	});
	found = posts.map((post) => ({ ...found, ...post }));
	res.status(200).json(found);
};

const getComments = (req, res) => {
	let id = req.params.id;
	let found = posts.find((post) => post.id === id);
	res.status(200).json({ total: found.comments.length, comments: found.comments });
};

const deleteComment = (req, res) => {
	let id = req.params.id;
	let cid = req.params.cid;
	let found = posts.find((post) => post.id === id);
	if (found == undefined) {
		return res.status(500).json({ msg: 'no comment to delete' });
	}
	found.comments.splice(found.comments[cid - 1], 1);
	found = posts.map((post) => ({ ...found, ...post }));
	res.status(200).json(posts);
};

const updateComment = (req, res) => {
	let id = req.params.id;
	let cid = req.params.cid;
	let found = posts.find((post) => post.id === id);
	found.comments.splice(found.comments[cid - 1], 1, { ...found.comments[cid - 1], ...req.body });
	found = posts.map((post) => ({ ...found, ...post }));
	res.send(posts);
};

module.exports = {
	getAllPosts,
	getPostById,
	createPost,
	deletePost,
	updatePostInfo,
	addComment,
	getComments,
	deleteComment,
	updateComment,
};
