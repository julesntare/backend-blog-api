import { v4 as uuidv4 } from 'uuid';

let posts = [
	{
		id: 'c55dee33-fd60-4011-a90c-goafaqcbe8sq',
		author: 'Jules NTARE',
		title: 'JS new features',
		desc: 'lorem ipsum',
		'cover-imgUrl': null,
		likes: 1,
		comments: [
			{
				id: 'c55dee33-fd60-4011-a90c-b1bssqcbe8sq',
				author: 'Jane Doe',
				desc: 'lorem ipsum',
				'replied-at': new Date(),
			},
		],
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
		comments: [
			{
				id: 'c55dee33-fd60-4011-a90c-tignyqcbe8sq',
				author: 'brown smith',
				desc: 'lorem ipsum',
				'replied-at': new Date(),
			},
		],
		state: 'published',
		'created-at': new Date(),
	},
];

posts = posts.map((post) => ({
	id: uuidv4(),
	...post,
}));

export default posts;
