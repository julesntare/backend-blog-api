import users from '../models/users.models';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import {} from 'dotenv/config';

const { SECRET_KEY } = process.env;
const getAllUsers = (req, res) => {
	res.send(users);
};

const getUserById = (req, res) => {
	let id = req.params.id;
	let user = users.filter((user) => user.id === id);
	res.send(user);
};

const createUser = (req, res) => {
	let salt = crypto.randomBytes(16).toString('base64');
	let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest('base64');
	let newUser = {};
	let { firstname, lastname, email } = req.body;
	let token = jwt.sign({ email, level: 2 }, SECRET_KEY, { algorithm: 'HS256' });
	newUser.id = uuidv4();
	newUser.firstname = firstname;
	newUser.lastname = lastname;
	newUser.email = email;
	req.body.password = salt + '$' + hash;
	newUser.password = req.body.password;
	newUser.noOfEntries = 1;
	newUser.level = 2;
	newUser.joined = new Date();

	users.push(newUser);
	res.send(token);
};

const deleteUser = (req, res) => {
	let id = req.params.id;
	let found = users.find((user) => user.id === id);
	users.splice(users.indexOf(found), 1);
	res.send(users);
};

const updateUserInfo = (req, res) => {
	let id = req.params.id;
	let found = users.find((user) => user.id === id);
	if (req.file) {
		users.splice(users.indexOf(found), 1, {
			...found,
			...req.body,
			[req.file.fieldname]: req.file.originalname,
		});
	} else {
		if (req.body.password) {
			let salt = crypto.randomBytes(16).toString('base64');
			let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest('base64');
			req.body.password = salt + '$' + hash;
		}
		users.splice(users.indexOf(found), 1, { ...found, ...req.body });
	}
	res.send(users);
};

module.exports = {
	getAllUsers,
	getUserById,
	createUser,
	deleteUser,
	updateUserInfo,
};
