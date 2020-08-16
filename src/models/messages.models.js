import { v4 as uuidv4 } from 'uuid';

let msgs = [
	{
		email: 'julesntare@gmail.com',
		name: 'Jules NTARE',
		msg: 'Hello, I need help on NodeJs',
		date: new Date(),
	},
	{
		email: 'uwingajoselyne@gmail.com',
		name: 'Joselyne UWINGABIRE',
		msg: 'Try to improve performance of your site',
		date: new Date(),
	},
	{
		email: 'bertin10@gmail.com',
		name: 'Bertin TUYISHIME',
		msg: 'Hello world',
		date: new Date(),
	},
];
msgs = msgs.map((msg) => ({ id: uuidv4(), ...msg }));

export default msgs;
