const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
import dotenv from 'dotenv';
const UserRoutes = require('./routes/users.routes');
const PostRoutes = require('./routes/posts.routes');
const MsgRoutes = require('./routes/messages.routes');
const mongoose = require('mongoose');
const mongoUrl = `mongodb+srv://julesntare:${process.env.MONGO_PASS}@cluster0.26qyi.mongodb.net/myBlogDb?retryWrites=true&w=majority`;

const port = process.env.PORT || 5000;

dotenv.config();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
	res.send('Welcome to my Blog API');
});
app.use('/users', UserRoutes);
app.use('/posts', PostRoutes);
app.use('/messages', MsgRoutes);

mongoose.Promise = global.Promise;
mongoose
	.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
	.then(() => {
		console.log('MongoDb connected!!!');
	})
	.catch((err) => {
		console.log(err);
	});
app.listen(port, () => {
	console.log(`app initialized on port ${port}`);
});
export default app;
