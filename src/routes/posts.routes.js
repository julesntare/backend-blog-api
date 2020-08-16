const express = require('express');
const router = express.Router();
let multer = require('multer');
import { getAllPosts, getPostById, createPost, deletePost, updatePostInfo } from '../controllers/posts.controllers';

// SET STORAGE
let storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'src/uploads/');
	},
	filename: (req, file, cb) => {
		cb(null, file.fieldname);
	},
});

let upload = multer({ storage: storage });

// get all posts
router.get('/', getAllPosts);

// get specific post by ID
router.get('/:id', getPostById);

// create post
router.post('/', createPost);

// delete post by ID
router.delete('/:id', deletePost);

// update post by ID
router.put('/:id', upload.single('cover-imgurl'), updatePostInfo);

module.exports = router;
