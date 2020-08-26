const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const UserRoutes = require('./routes/users.routes');
const PostRoutes = require('./routes/posts.routes');
const MsgRoutes = require('./routes/messages.routes');

const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
	res.status(200).send({ msg: 'Welcome to my Blog API' });
});
app.use('/users', UserRoutes);
app.use('/posts', PostRoutes);
app.use('/messages', MsgRoutes);

app.listen(port, () => {
	console.log(`app initialized on port ${port}`);
});

export default app;
