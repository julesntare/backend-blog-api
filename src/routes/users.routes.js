const express = require('express');
const router = express.Router();
let multer = require('multer');
import { getAllUsers, getUserById, createUser, deleteUser, updateUserInfo } from '../controllers/users.controllers';

const DIR = './src/uploads';

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

// get all users
router.get('/', getAllUsers);

// get specific user by ID
router.get('/:id', getUserById);

// create user
router.post('/', createUser);

// delete user by ID
router.delete('/:id', deleteUser);

// update user by ID
router.put('/:id', upload.single('profile-img-url'), updateUserInfo);

module.exports = router;
