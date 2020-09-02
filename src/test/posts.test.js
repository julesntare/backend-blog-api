import chai, { expect, assert, should } from 'chai';
import request from 'supertest';
should();
import chaiHttp from 'chai-http';
import app from '../index';
import User from '../models/users.models';
import Post from '../models/posts.models';
import faker, { fake } from 'faker';
import fs from 'fs';
import path from 'path';
chai.use(chaiHttp);

let token, postId, wrongToken;
describe('========== Posts APIs Tests ==========', () => {
	before(async () => {
		await Post.deleteMany({});
		await User.deleteMany({});
	});
	describe('POST /posts', () => {
		it('should return 200', (done) => {
			chai.request(app)
				.post('/users/register')
				.send({
					firstname: faker.name.firstName(),
					lastname: faker.name.lastName(),
					email: 'julesntare@gmail.com',
					password: 'hUhU1!',
					cpassword: 'hUhU1!',
				})
				.end((err, res) => {
					expect(res).to.have.status(200);
					token = res.body.token;
					done();
				});
		});

		it('should return 200 with wrong token', (done) => {
			chai.request(app)
				.post('/users/register')
				.send({
					firstname: faker.name.firstName(),
					lastname: faker.name.lastName(),
					email: faker.internet.email(),
					password: 'hUhU1!',
					cpassword: 'hUhU1!',
				})
				.end((err, res) => {
					expect(res).to.have.status(200);
					wrongToken = res.body.token;
					done();
				});
		});

		it('should add a SINGLE post', (done) => {
			chai.request(app)
				.post('/posts')
				.set('authorization', `Bearer ${token}`)
				.send({ author: 'julesntare@gmail.com', title: faker.name.title(), desc: faker.lorem.paragraph() })
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(201);
					postId = res.body.data._id;
					done();
				});
		});

		// it('should add a SINGLE post with image', (done) => {
		// 	chai.request(app)
		// 		.post('/posts')
		// 		.type('form')
		// 		.set('authorization', `Bearer ${token}`)
		// 		.set('Content-Type', 'application/x-www-form-urlencoded')
		// 		.set('Content-Type', 'multipart/form-data')
		// 		.field('author', 'julesntare@gmail.com')
		// 		.field('title', faker.name.title())
		// 		.field('desc', faker.lorem.paragraphs())
		// 		.attach(
		// 			'cover-imgUrl',
		// 			fs.readFileSync(path.join(__dirname, '../posts-images/project-bg.jpg')),
		// 			'project-bg.jpg'
		// 		)
		// 		.end((err, res) => {
		// 			if (err) return done(err);
		// 			expect(res).to.have.status(201);
		// 			done();
		// 		});
		// });

		it('should not add post with bad token', (done) => {
			chai.request(app)
				.post('/posts')
				.set('authorization', `fsfsfaf`)
				.send({ author: 'julesntare@gmail.com', title: faker.name.title(), desc: faker.lorem.paragraph() })
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(401);
					done();
				});
		});

		it('should not add post with bad author input', (done) => {
			chai.request(app)
				.post('/posts')
				.set('authorization', `Bearer ${token}`)
				.send({ author: 'julesntare', title: faker.name.title(), desc: faker.lorem.paragraph() })
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(400);
					done();
				});
		});

		it('should not add post with bad title input', (done) => {
			chai.request(app)
				.post('/posts')
				.set('authorization', `Bearer ${token}`)
				.send({ author: 'julesntare@gmail.com', title: 'ds', desc: faker.lorem.paragraph() })
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(400);
					done();
				});
		});

		it('should not add post with bad desc input', (done) => {
			chai.request(app)
				.post('/posts')
				.set('authorization', `Bearer ${token}`)
				.send({ author: 'julesntare@gmail.com', title: faker.name.title(), desc: {} })
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(400);
					done();
				});
		});

		it('should not add post with bad state input', (done) => {
			chai.request(app)
				.post('/posts')
				.set('authorization', `Bearer ${token}`)
				.send({
					author: 'julesntare@gmail.com',
					title: faker.name.title(),
					desc: faker.lorem.paragraphs(),
					state: 'ds',
				})
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(400);
					done();
				});
		});

		it('should not add post with unregistered author', (done) => {
			chai.request(app)
				.post('/posts')
				.set('authorization', `Bearer ${token}`)
				.send({
					author: 'fsfas@gmail.com',
					title: faker.name.title(),
					desc: faker.lorem.paragraphs(),
					state: 'ds',
				})
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(400);
					done();
				});
		});

		it('should add a post with state', (done) => {
			chai.request(app)
				.post('/posts')
				.set('authorization', `Bearer ${token}`)
				.send({
					author: 'julesntare@gmail.com',
					title: faker.name.title(),
					desc: faker.lorem.paragraph(),
					state: 'draft',
				})
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(201);
					postId = res.body.data._id;
					done();
				});
		});

		it('should not add post with empty data', (done) => {
			chai.request(app)
				.post('/posts')
				.set('authorization', `Bearer ${token}`)
				.send({})
				.end((err, res) => {
					expect(res).to.have.status(400);
					done();
				});
		});

		it('should not add post with no title', (done) => {
			chai.request(app)
				.post('/posts')
				.set('authorization', `Bearer ${token}`)
				.send({ author: faker.name.firstName() + ' ' + faker.name.lastName(), desc: faker.lorem.paragraph() })
				.end((err, res) => {
					expect(res).to.have.status(400);
					done();
				});
		});

		it('should not add post with empty title', (done) => {
			chai.request(app)
				.post('/posts')
				.set('authorization', `Bearer ${token}`)
				.send({ title: '', desc: faker.lorem.paragraph() })
				.end((err, res) => {
					expect(res).to.have.status(400);
					done();
				});
		});
	});

	describe('GET /posts', () => {
		it('should list ALL posts on /posts GET', (done) => {
			chai.request(app)
				.get('/posts')
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(200);
					res.body.should.be.a('array');
					done();
				});
		});
	});

	describe('GET /posts/id', () => {
		it('should list a SINGLE post with id', () => {
			let param = postId;
			chai.request(app)
				.get('/posts/' + param)
				.end((err, res) => {
					expect(res).to.have.status(200);
				});
		});

		it('should not list post with unavailable id', () => {
			let param = 'dsgs';
			chai.request(app)
				.get('/posts/' + param)
				.end((err, res) => {
					expect(res).to.have.status(404);
					expect(res.body).to.deep.equal({ msg: 'post not found' });
				});
		});
	});

	describe('PUT /posts/id', () => {
		it('should update a SINGLE post with id', (done) => {
			let param = postId;
			chai.request(app)
				.put('/posts/' + param)
				.set('Content-Type', 'application/x-www-form-urlencoded')
				.set('authorization', `Bearer ${token}`)
				.send({ desc: faker.lorem.paragraphs() })
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(200);
					done();
				});
		});

		// it('should update a SINGLE post with image', (done) => {
		// 	let param = postId;
		// 	request(app)
		// 		.put('/posts/' + param)
		// 		.set('authorization', `Bearer ${token}`)
		// 		.set('Content-Type', 'multipart/form-data')
		// 		.field('desc', faker.lorem.paragraphs())
		// 		.attach('cover-imgUrl', fs.readFileSync(path.join(__dirname, '../posts-images/css3.png')), 'css3.png')
		// 		.end((err, res) => {
		// 			if (err) return done(err);
		// 			expect(res).to.have.status(200);
		// 			done();
		// 		});
		// });

		it('should not add post with bad author input', (done) => {
			let param = postId;
			chai.request(app)
				.put('/posts/' + param)
				.set('authorization', `Bearer ${token}`)
				.send({ author: 'julesntare', title: faker.name.title(), desc: faker.lorem.paragraph() })
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(400);
					done();
				});
		});

		it('should not add post with bad title input', (done) => {
			let param = postId;
			chai.request(app)
				.put('/posts/' + param)
				.set('authorization', `Bearer ${token}`)
				.send({ author: 'julesntare@gmail.com', title: 'ds', desc: faker.lorem.paragraph() })
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(400);
					done();
				});
		});

		it('should not add post with bad desc input', (done) => {
			let param = postId;
			chai.request(app)
				.put('/posts/' + param)
				.set('authorization', `Bearer ${token}`)
				.send({ author: 'julesntare@gmail.com', title: faker.name.title(), desc: {} })
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(400);
					done();
				});
		});

		it('should not add post with bad state input', (done) => {
			let param = postId;
			chai.request(app)
				.put('/posts/' + param)
				.set('authorization', `Bearer ${token}`)
				.send({
					author: 'julesntare@gmail.com',
					title: faker.name.title(),
					desc: faker.lorem.paragraphs(),
					state: 'ds',
				})
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(400);
					done();
				});
		});

		it('should not update post with wrong id', (done) => {
			let param = 'c55dee33sdsada';
			chai.request(app)
				.put('/posts/' + param)
				.set('Content-Type', 'application/x-www-form-urlencoded')
				.set('authorization', `Bearer ${token}`)
				.send({ desc: faker.lorem.paragraphs() })
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(401);
					done();
				});
		});

		it('should not update post with empty data', (done) => {
			let param = postId;
			chai.request(app)
				.put('/posts/' + param)
				.set('authorization', `Bearer ${token}`)
				.send({})
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(409);
					done();
				});
		});
	});

	describe('DELETE /posts/id', () => {
		it('should delete a SINGLE post', () => {
			let param = postId;
			chai.request(app)
				.delete('/posts/' + param)
				.set('authorization', `Bearer ${token}`)
				.end((err, res) => {
					expect(res).to.have.status(204);
				});
		});

		it('should not delete post with unavailable id', () => {
			let param = 'dsgs';
			chai.request(app)
				.delete('/posts/' + param)
				.set('authorization', `Bearer ${token}`)
				.end((err, res) => {
					expect(res).to.have.status(404);
				});
		});
	});
});
