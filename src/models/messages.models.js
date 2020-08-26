import { v4 as uuidv4 } from 'uuid';

let msgs = [
	{
		id: 'c55dee33-fd60-4011-a90c-b1bfeacbe8ea',
		email: 'julesntare@gmail.com',
		name: 'Jules NTARE',
		msg: 'Hello, I need help on NodeJs',
		date: new Date(),
	},
	{
		id: 'c55dee33-fd60-4011-a90c-dfsf',
		email: 'uwingajoselyne@gmail.com',
		name: 'Joselyne UWINGABIRE',
		msg: 'Try to improve performance of your site',
		date: new Date(),
	},
	{
		id: 'c55dee33-fd60-40sa-a90c-fsds',
		email: 'bertin10@gmail.com',
		name: 'Bertin TUYISHIME',
		msg: 'Hello world',
		date: new Date(),
	},
];
msgs = msgs.map((msg) => ({ id: uuidv4(), ...msg }));

export default msgs;
