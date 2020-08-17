import posts from '../models/posts.models';
import { v4 as uuidv4 } from 'uuid';

const getAllPosts = (req, res) => {
	res.send(posts);
};

const getPostById = (req, res) => {
	let id = req.params.id;
	let post = posts.filter((post) => post.id === id);
	res.send(post);
};

const createPost = (req, res) => {
	let newPost = {};
	newPost.id = uuidv4();
	newPost['author'] = req.body.author;
	newPost['title'] = req.body.title;
	newPost['desc'] = req.body.desc;
	newPost['cover-imgUrl'] = req.file.originalname | null;
	newPost['likes'] = 0;
	newPost['comments'] = [];
	newPost['state'] = 'published';
	newPost['created-at'] = new Date();
	posts.push(newPost);
	res.send(posts);
};

const deletePost = (req, res) => {
	let id = req.params.id;
	let found = posts.find((post) => post.id === id);
	posts.splice(posts.indexOf(found), 1);
	res.send(posts);
};

const updatePostInfo = (req, res) => {
	let id = req.params.id;
	let found = posts.find((post) => post.id === id);
	posts.splice(posts.indexOf(found), 1, { ...found, ...req.body, [req.file.fieldname]: req.file.originalname });
	res.send(posts);
};

const addComment = (req, res) => {
	let id = req.params.id;
	let found = posts.find((post) => post.id === id);
	found.comments.unshift({
		'replied-at': new Date(),
		...req.body,
	});
	found = posts.map((post) => ({ ...found, ...post }));
	res.send(found);
};

const deleteComment = (req, res) => {
	let id = req.params.id;
	let cid = req.params.cid;
	let found = posts.find((post) => post.id === id);
	found.comments.splice(found.comments[cid - 1], 1);
	found = posts.map((post) => ({ ...found, ...post }));
	res.send(posts);
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
	deleteComment,
	updateComment,
};
