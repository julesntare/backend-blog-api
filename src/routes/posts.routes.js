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

const DIR = './src/posts-images';

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, DIR);
	},
	filename: (req, file, cb) => {
		const fileName = file.originalname;
		cb(null, fileName);
	},
});

let upload = multer({
	storage: storage,
	fileFilter: (req, file, cb) => {
		if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
			cb(null, true);
		} else {
			cb(null, false);
			return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
		}
	},
});

// get all posts
router.get('/', getAllPosts);

// get specific post by ID
router.get('/:id', getPostById);

// create post
router.post('/', createPost);

// delete post by ID
router.delete('/:id', deletePost);

// update post by ID
router.put('/:id', upload.single('cover-imgUrl'), updatePostInfo);

// add comment on post
router.patch('/:id/comment/', addComment);

// add comment on post
router.patch('/:id/comment/:cid', deleteComment);

// edit comment on post
router.patch('/:id/editcomment/:cid', updateComment);

export default router;
