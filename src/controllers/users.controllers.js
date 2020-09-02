import users from '../models/users.models';
import dotenv from 'dotenv';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import {} from 'dotenv/config';
const cloudinary = require('cloudinary').v2;

dotenv.config();
cloudinary.config({
	cloud_name: 'julesntare',
	api_key: process.env.cloudinary_API_KEY,
	api_secret: process.env.cloudinary_API_SECRET,
});

const { SECRET_KEY } = process.env;
const getAllUsers = async (req, res) => {
	const userData = await users.find();
	res.status(200).json(userData);
};

const getUserById = (req, res) => {
	let id = req.params.id;
	users
		.findById(id)
		.then((result) => {
			if (result == null) return res.status(404).json({ msg: 'Invalid user' });
			res.status(200).json(result);
		})
		.catch((e) => {
			res.status(404).json({ msg: 'User Not found' });
		});
};

const getHashedPassword = (password) => {
	const sha256 = crypto.createHash('sha256');
	const hash = sha256.update(password).digest('base64');
	return hash;
};

const createUser = async (req, res) => {
	let newUser = {};
	let { firstname, lastname, email, password } = req.body;
	const checkUser = await users.findOne({ email: email });
	try {
		if (checkUser != null) {
			return res.status(409).json({ message: 'Email already in use' });
		}
		let level = email == 'julesntare@gmail.com' ? 1 : 2;
		let token = jwt.sign({ email, level: level }, SECRET_KEY, { algorithm: 'HS256' });
		newUser.firstname = firstname;
		newUser.lastname = lastname;
		newUser.email = email;
		newUser.password = getHashedPassword(password);
		newUser['profile-img-url'] = null;
		newUser.noOfEntries = 1;
		newUser.level = level;
		const user = new users(newUser);
		user.save().then((data) => {
			res.status(200).json({ msg: 'User Added Successfully', data, token });
		});
	} catch (e) {
		res.status(500).json({ msg: 'something went wrong!!!, try again' });
	}
};

const loginUser = async (req, res) => {
	let { email, password } = req.body,
		level,
		token,
		loginInfo;
	if (Object.keys(req.body).length == 0) {
		return res.status(409).json({ message: 'Please provide data' });
	}
	password = getHashedPassword(password);
	loginInfo = await users.findOne({ email: email });
	if (loginInfo === null) {
		return res.status(404).json({ message: 'Invalid Email' });
	}
	level = loginInfo.level;
	token = jwt.sign({ email, level }, SECRET_KEY, { algorithm: 'HS256' });
	if (getHashedPassword(loginInfo.password) !== getHashedPassword(password)) {
		return res.status(404).json({ message: 'Invalid Password' });
	}
	res.status(200).json({ data: loginInfo, token });
};

const deleteUser = async (req, res) => {
	let id = req.params.id;
	users.findOneAndDelete({ _id: id }, (err) => {
		if (err) return res.status(404).json({ msg: 'Invalid id' });
		res.status(204).send();
	});
};

const updateUserInfo = async (req, res) => {
	let id = req.params.id,
		found;
	found = await users.findByIdAndUpdate({ _id: id }, { ...req.body });
	if (Object.keys(req.body).length == 0) {
		return res.status(400).json({
			msg:
				'Please you have to edit one or more of these(firstname, lastname, email,bio,location,links and profile-img-url)',
		});
	}
	if (found === null) {
		return res.status(404).json({ msg: 'No user to edit' });
	}
	if (req.file) {
		const path = req.file.path;
		cloudinary.uploader.upload(path, (err, image) => {
			if (err) return res.status(404).json(err);
			const fs = require('fs');
			fs.unlinkSync(path);
			if (image) {
				found['profile-img-url'] = image.url;
				found.save();
				res.status(200).json({ msg: 'User updated' });
			}
		});
	} else {
		found.save();
		res.status(200).json({ msg: 'User updated' });
	}
};

module.exports = {
	getAllUsers,
	getUserById,
	createUser,
	deleteUser,
	updateUserInfo,
	loginUser,
};
