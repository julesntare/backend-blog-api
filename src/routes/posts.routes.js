const express = require('express');
const router = express.Router();
let multer = require('multer');
import {
	getAllPosts,
	getPostById,
	createPost,
	deletePost,
	updatePostInfo,
	addComment,
	deleteComment,
	updateComment,
} from '../controllers/posts.controllers';

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

// add comment on post
router.patch('/:id/comment/', addComment);

// add comment on post
router.patch('/:id/comment/:cid', deleteComment);

// edit comment on post
router.patch('/:id/editcomment/:cid', updateComment);

module.exports = router;
