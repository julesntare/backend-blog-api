import messages from '../models/messages.models';

const getAllMsgs = async (req, res) => {
	const messageData = await messages.find();
	res.status(200).json(messageData);
};

const getMsgById = (req, res) => {
	let id = req.params.id;
	messages
		.findById(id)
		.then((result) => {
			res.status(200).json(result);
		})
		.catch((err) => {
			res.status(404).json({ msg: 'no message available' });
		});
};

const createMsg = async (req, res) => {
	let newMsg = {};
	newMsg.name = req.body.name;
	newMsg.email = req.body.email;
	newMsg.msg = req.body.msg;
	if (Object.keys(req.body).length == 0) {
		return res.status(500).json({ msg: 'please add data' });
	}
	const msg = new messages(newMsg);
	const msgData = await msg.save();
	res.status(201).json({ msg: 'Message added', msgData });
};

const deleteMsg = async (req, res) => {
	let id = req.params.id;
	try {
		let found = await messages.findByIdAndDelete(id);
		if (found == null) {
			return res.status(404).json({ msg: 'no message to delete' });
		}
		res.status(204).send();
	} catch (e) {
		return res.status(404).json({ msg: 'no message to delete' });
	}
};

module.exports = {
	getAllMsgs,
	getMsgById,
	createMsg,
	deleteMsg,
};
