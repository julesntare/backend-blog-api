import { v4 as uuidv4 } from 'uuid';

let users = [
	{
		firstname: 'Jules',
		lastname: 'NTARE',
		email: 'julesntare@gmail.com',
		'profile-img-url':
			'https://firebasestorage.googleapis.com/v0/b/portfolio-db-d0d5c.appspot.com/o/images%2Fcontactme-bg.jpg?alt=media&token=f703f173-edaa-4056-8b9f-5de071056656',
		password: 'dgddgg',
		location: 'Kigali, muhima, KN88st',
		bio: 'Software Engineer',
		noOfEntries: 0,
		level: 1,
		joined: new Date(),
	},
	{
		firstname: 'John',
		lastname: 'Doe',
		email: 'johndoe@gmail.com',
		'profile-img-url':
			'https://firebasestorage.googleapis.com/v0/b/portfolio-db-d0d5c.appspot.com/o/images%2Fcontactme-bg.jpg?alt=media&token=f703f173-edaa-4056-8b9f-5de071056656',
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
