import { v4 as uuidv4 } from 'uuid';

let posts = [
	{
		id: 'c55dee33-fd60-4011-a90c-b1bfeacbe8ea',
		author: 'Jules NTARE',
		title: 'JS new features',
		desc: 'lorem ipsum',
		'cover-imgUrl': null,
		likes: 1,
		comments: [],
		state: 'published',
		'created-at': new Date(),
	},
	{
		id: 'c55dee33-fd60-4011-a90c-b1bfeacbe8sq',
		author: 'John Doe',
		title: 'What is Programming',
		desc: 'lorem ipsum',
		'cover-imgUrl': null,
		likes: 10,
		comments: [],
		state: 'published',
		'created-at': new Date(),
	},
];

posts = posts.map((post) => ({
	id: uuidv4(),
	...post,
}));

export default posts;
