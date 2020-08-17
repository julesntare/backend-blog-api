import { v4 as uuidv4 } from 'uuid';

let posts = [
	{
		author: 'Jules NTARE',
		title: 'JS new features',
		desc: 'lorem ipsum',
		'cover-imgUrl': null,
		likes: 1,
		comments: [{ author: 'johndoe@gmail.com', desc: 'nice post', 'replied-at': new Date() }],
		state: 'published',
		'created-at': new Date(),
	},
	{
		author: 'John Doe',
		title: 'What is Programming',
		desc: 'lorem ipsum',
		'cover-imgUrl': null,
		likes: 10,
		comments: [{ author: 'julentare@gmail.com', desc: 'nice post', 'replied-at': new Date() }],
		state: 'published',
		'created-at': new Date(),
	},
];

posts = posts.map((post) => ({
	id: uuidv4(),
	...post,
}));

export default posts;
