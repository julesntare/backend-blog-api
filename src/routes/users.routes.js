const express = require('express');
const router = express.Router();
let multer = require('multer');
import {
	getAllUsers,
	getUserById,
	createUser,
	deleteUser,
	updateUserInfo,
	loginUser,
} from '../controllers/users.controllers';
import verifyAuth from '../middlewares/auth';
import loginSignupAuthorization from '../middlewares/login_signup_auth';
import adminAuth from '../middlewares/admin_auth';
import userValidations from '../middlewares/validations/userValidations';

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
router.get('/', adminAuth, getAllUsers);

// get specific user by ID
router.get('/:id', [verifyAuth], getUserById);

// create user
router.post('/register', [loginSignupAuthorization, userValidations.userAddValidations], createUser);

// login user
router.post('/login', loginSignupAuthorization, loginUser);

// delete user by ID
router.delete('/:id', [verifyAuth], deleteUser);

// update user by ID
router.put('/:id', [verifyAuth, userValidations.userEditValidations], upload.single('profile-img-url'), updateUserInfo);

module.exports = router;
