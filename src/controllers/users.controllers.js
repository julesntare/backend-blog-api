import users from '../models/users.models';
import { v4 as uuidv4 } from 'uuid';

const getAllUsers = (req, res) => {
	res.send(users);
};

const getUserById = (req, res) => {
	let id = req.params.id;
	let user = users.filter((user) => user.id === id);
	res.send(user);
};

const createUser = (req, res) => {
	let newUser = {};
	newUser.id = uuidv4();
	newUser.firstname = req.body.firstname;
	newUser.lastname = req.body.lastname;
	newUser.email = req.body.email;
	newUser.password = req.body.password;
	newUser.noOfEntries = 1;
	newUser.level = 2;
	newUser.joined = new Date();
	users.push(newUser);
	res.send(users);
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
	users.splice(users.indexOf(found), 1, { ...found, ...req.body });
	res.send(users);
};

module.exports = {
	getAllUsers,
	getUserById,
	createUser,
	deleteUser,
	updateUserInfo,
};
