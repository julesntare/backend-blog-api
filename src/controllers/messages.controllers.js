import messages from '../models/messages.models';
import { v4 as uuidv4 } from 'uuid';

const getAllMsgs = (req, res) => {
	res.send(messages);
};

const getMsgById = (req, res) => {
	let id = req.params.id;
	let msg = messages.filter((msg) => msg.id === id);
	if (msg.length === 0) {
		return res.status(404).json({ msg: 'no message available' });
	}
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
	if (Object.keys(req.body).length == 0) {
		return res.status(500).json({ msg: 'please add data' });
	}
	res.send(messages);
};

const deleteMsg = (req, res) => {
	let id = req.params.id;
	let found = messages.find((msg) => msg.id === id);
	if (found == undefined) {
		return res.status(404).json({ msg: 'no message to delete' });
	}
	messages.splice(messages.indexOf(found), 1);
	res.send(messages);
};

module.exports = {
	getAllMsgs,
	getMsgById,
	createMsg,
	deleteMsg,
};
