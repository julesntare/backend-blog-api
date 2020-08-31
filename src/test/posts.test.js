import chai, { expect, assert, should } from 'chai';
should();
import chaiHttp from 'chai-http';
import app from '../index';
import faker, { fake } from 'faker';
import fs from 'fs';
import path from 'path';
chai.use(chaiHttp);

let token, postId;
describe('POST /posts', () => {
	it('should return 200', (done) => {
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
				token = res.body.token;
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

	it('should not add post with empty data', (done) => {
		chai.request(app)
			.post('/posts')
			.set('authorization', `Bearer ${token}`)
			.send({})
			.end((err, res) => {
				expect(res).to.have.status(403);
				done();
			});
	});

	it('should not add post with no title', (done) => {
		chai.request(app)
			.post('/posts')
			.set('authorization', `Bearer ${token}`)
			.send({ author: faker.name.firstName() + ' ' + faker.name.lastName(), desc: faker.lorem.paragraph() })
			.end((err, res) => {
				expect(res).to.have.status(403);
				done();
			});
	});

	it('should not add post with empty title', (done) => {
		chai.request(app)
			.post('/posts')
			.set('authorization', `Bearer ${token}`)
			.send({ title: '', desc: faker.lorem.paragraph() })
			.end((err, res) => {
				expect(res).to.have.status(403);
				done();
			});
	});
});

describe('========== Posts APIs Tests ==========', () => {
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

		it('should not update post with wrong id', (done) => {
			let param = 'c55dee33sdsada';
			chai.request(app)
				.put('/posts/' + param)
				.set('Content-Type', 'application/x-www-form-urlencoded')
				.set('authorization', `Bearer ${token}`)
				.send({ desc: faker.lorem.paragraphs() })
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(403);
					done();
				});
		});

		it('should update post with no image', (done) => {
			let param = postId;
			chai.request(app)
				.put('/posts/' + param)
				.set('Content-Type', 'application/x-www-form-urlencoded')
				.set('authorization', `Bearer ${token}`)
				.field('desc', faker.lorem.paragraphs())
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(200);
					done();
				});
		});

		it('should not update post with empty data', (done) => {
			let param = 'c55dee33-fd60-4011-a90c-b1bfeacbe8sq';
			chai.request(app)
				.put('/posts/' + param)
				.set('authorization', `Bearer ${token}`)
				.send({})
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(403);
					done();
				});
		});
	});

	describe('DELETE /posts/id', () => {
		it('should delete a SINGLE post on /posts/<id> DELETE', () => {
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
