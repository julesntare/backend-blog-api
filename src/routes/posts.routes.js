const express = require('express');
const router = express.Router();
let multer = require('multer');
import { getAllPosts, getPostById, createPost, deletePost, updatePostInfo } from '../controllers/posts.controllers';
import {
	addComment,
	getComments,
	getCommentById,
	deleteComment,
	updateComment,
} from '../controllers/comments.controllers';
import verifyAuth from '../middlewares/auth';
import postValidations from '../middlewares/validations/postValidations';
import verifyPostAccess from '../middlewares/post_auth';

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
router.post('/', [verifyAuth, postValidations.postAddValidations], upload.single('cover-imgUrl'), createPost);

// delete post by ID
router.delete('/:id', deletePost);

// update post by ID
router.put(
	'/:id',
	[verifyPostAccess, postValidations.postEditValidations],
	upload.single('cover-imgUrl'),
	updatePostInfo
);

// get comments on post
router.get('/:id/comments/', getComments);

// get specific comment on post
router.get('/:id/comments/:cid', getCommentById);

// add comment on post
router.post('/:id/comment/', [verifyAuth], addComment);

// delete comment on post
router.delete('/:id/comment/:cid', [verifyAuth], deleteComment);

// edit comment on post
router.put('/:id/editcomment/:cid', [verifyAuth], updateComment);

module.exports = router;
