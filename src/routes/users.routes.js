const express = require('express');
const router = express.Router();
let multer = require('multer');
import { getAllUsers, getUserById, createUser, deleteUser, updateUserInfo } from '../controllers/users.controllers';

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
