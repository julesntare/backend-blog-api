import { v4 as uuidv4 } from 'uuid';

let users = [
	{
		id: 'c55dee33-fd60-4011-a90c-b1bfeacbe8ea',
		firstname: 'Jules',
		lastname: 'NTARE',
		email: 'julesntare@gmail.com',
		'profile-img-url': null,
		password: '4JLAj6B9pRMdhRiXhJOkRjlPMDkIxYoKrEp2j4Qgz7c=',
		location: 'Kigali, muhima, KN88st',
		bio: 'Software Engineer',
		noOfEntries: 0,
		level: 1,
		joined: new Date(),
	},
	{
		id: 'c55dee33-fd60-4011-a90c-b1bfeacbe8eq',
		firstname: 'John',
		lastname: 'Doe',
		email: 'johndoe@gmail.com',
		'profile-img-url': null,
		password: 'dnajkdnwk',
		location: 'London NW1 6XE',
		bio: 'CEO',
		noOfEntries: 0,
		level: 2,
		joined: new Date(),
	},
];

users = users.map((user) => ({ id: uuidv4(), ...user }));

export default users;
