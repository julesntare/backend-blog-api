const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// example to operate on
let tasks = {
	1: { id: '1', desc: 'learn from tutorials', state: 'done' },
	2: { id: '2', desc: 'work on portfolio project', state: 'pending' },
};

// GET methods
// for users
app.get('/tasks', (req, res) => {
	res.send(tasks);
});

app.get('/tasks/:id', (req, res) => {
	res.send(tasks[req.params.id]);
});

// POST method
app.post('/tasks', (req, res) => {
	const newTask = {
		id: Object.keys(tasks).length + 1,
		desc: req.body.desc,
		state: req.body.state,
	};
	tasks[Object.keys(tasks).length + 1] = newTask;
	res.send(tasks);
});

// PUT method
app.put('/tasks/:id', (req, res) => {
	tasks = { ...tasks, [req.params.id]: { desc: req.body.desc, state: req.body.state } };
	res.send(tasks);
});

// DELETE method
app.delete('/tasks/:id', (req, res) => {
	const { [req.params.id]: task, ...otherTasks } = tasks;
	tasks = otherTasks;
	res.send(tasks);
});

app.listen(5000, () => {
	console.log('app listening on port 5000');
});
