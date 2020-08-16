import { v4 as uuidv4 } from 'uuid';

let posts = [
	{
		author: 'Jules NTARE',
		title: 'JS new features',
		desc: 'lorem ipsum',
		'cover-imgUrl':
			'https://firebasestorage.googleapis.com/v0/b/portfolio-db-d0d5c.appspot.com/o/images%2Ftimerate.PNG?alt=media&token=2fda0eb1-7f43-4e87-b2b5-1396c3d40b5e',
		likes: 1,
		comments: [{ 'comment-author': 'johndoe@gmail.com', 'comment-dec': 'nice post', 'replied-at': new Date() }],
		state: 'published',
		'created-at': new Date(),
	},
	{
		author: 'John Doe',
		title: 'What is Programming',
		desc: 'lorem ipsum',
		'cover-imgUrl':
			'https://firebasestorage.googleapis.com/v0/b/portfolio-db-d0d5c.appspot.com/o/images%2Ftimerate.PNG?alt=media&token=2fda0eb1-7f43-4e87-b2b5-1396c3d40b5e',
		likes: 10,
		comments: [{ 'comment-author': 'julentare@gmail.com', 'comment-dec': 'nice post', 'replied-at': new Date() }],
		state: 'published',
		'created-at': new Date(),
	},
];

posts = posts.map((post) => ({
	id: uuidv4(),
	...post,
}));

export default posts;
