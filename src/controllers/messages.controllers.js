import messages from '../models/messages.models';
import { v4 as uuidv4 } from 'uuid';

const getAllMsgs = (req, res) => {
	res.send(messages);
};

const getMsgById = (req, res) => {
	let id = req.params.id;
	let msg = messages.filter((msg) => msg.id === id);
	res.send(msg);
};

const createMsg = (req, res) => {
	let newMsg = {};
	newMsg.id = uuidv4();
	newMsg.name = req.body.name;
	newMsg.email = req.body.email;
	newMsg.msg = req.body.msg;
	newMsg.date = new Date();
	messages.push(newMsg);
	res.send(messages);
};

const deleteMsg = (req, res) => {
	let id = req.params.id;
	let found = messages.find((msg) => msg.id === id);
	messages.splice(messages.indexOf(found), 1);
	res.send(messages);
};

module.exports = {
	getAllMsgs,
	getMsgById,
	createMsg,
	deleteMsg,
};
