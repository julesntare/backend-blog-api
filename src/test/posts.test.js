import chai, { expect, assert, should } from 'chai';
should();
import chaiHttp from 'chai-http';
import app from '../index';
import faker, { fake } from 'faker';
import fs from 'fs';
import path from 'path';
chai.use(chaiHttp);

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
			let param = 'c55dee33-fd60-4011-a90c-goafaqcbe8sq';
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

	describe('POST /posts', () => {
		it('should add a SINGLE post', (done) => {
			chai.request(app)
				.post('/posts')
				.set('Content-Type', 'application/x-www-form-urlencoded')
				.field('author', faker.name.firstName() + ' ' + faker.name.lastName())
				.field('title', faker.name.title())
				.field('desc', faker.lorem.paragraphs())
				.attach('cover-imgUrl', fs.readFileSync(path.join(__dirname, '../uploads/css3.png')), 'css3.png')
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(200);
					done();
				});
		});

		it('should add post with no image', (done) => {
			chai.request(app)
				.post('/posts')
				.set('Content-Type', 'application/x-www-form-urlencoded')
				.field('author', faker.name.firstName() + ' ' + faker.name.lastName())
				.field('title', faker.name.title())
				.field('desc', faker.lorem.paragraphs())
				.field('state', 'draft')
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(200);
					done();
				});
		});

		it('should not add post with empty data', (done) => {
			chai.request(app)
				.post('/posts')
				.send({})
				.end((err, res) => {
					expect(res).to.have.status(500);
					done();
				});
		});

		it('should not add post with no title', (done) => {
			chai.request(app)
				.post('/posts')
				.send({ author: faker.name.firstName() + ' ' + faker.name.lastName(), desc: faker.lorem.paragraph() })
				.end((err, res) => {
					expect(res).to.have.status(206);
					done();
				});
		});

		it('should not add post with empty title', (done) => {
			chai.request(app)
				.post('/posts')
				.send({ title: '', desc: faker.lorem.paragraph() })
				.end((err, res) => {
					expect(res).to.have.status(206);
					done();
				});
		});
	});

	describe('PUT /posts/id', () => {
		it('should update a SINGLE post with id', (done) => {
			let param = 'c55dee33-fd60-4011-a90c-b1bfeacbe8sq';
			chai.request(app)
				.put('/posts/' + param)
				.set('Content-Type', 'application/x-www-form-urlencoded')
				.field('desc', faker.lorem.paragraphs())
				.attach('cover-imgUrl', fs.readFileSync(path.join(__dirname, '../uploads/css3.png')), 'css3.png')
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(200);
					done();
				});
		});

		it('should update post with wrong id', (done) => {
			let param = 'c55dee33-fd60-4011-a90c-sdsada';
			chai.request(app)
				.put('/posts/' + param)
				.set('Content-Type', 'application/x-www-form-urlencoded')
				.field('desc', faker.lorem.paragraphs())
				.attach('cover-imgUrl', fs.readFileSync(path.join(__dirname, '../uploads/css3.png')), 'css3.png')
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(404);
					done();
				});
		});

		it('should update post with no image', (done) => {
			let param = 'c55dee33-fd60-4011-a90c-b1bfeacbe8sq';
			chai.request(app)
				.put('/posts/' + param)
				.set('Content-Type', 'application/x-www-form-urlencoded')
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
				.send({})
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(500);
					done();
				});
		});
	});

	describe('DELETE /posts/id', () => {
		it('should delete a SINGLE post on /posts/<id> DELETE', () => {
			let param = 'c55dee33-fd60-4011-a90c-b1bfeacbe8sq';
			chai.request(app)
				.delete('/posts/' + param)
				.end((err, res) => {
					expect(res).to.have.status(200);
				});
		});
		it('should not delete post with unavailable id', () => {
			let param = 'dsgs';
			chai.request(app)
				.delete('/posts/' + param)
				.end((err, res) => {
					expect(res).to.have.status(404);
				});
		});
	});

	describe('GET /posts/id/comments', () => {
		it('should get all comments', (done) => {
			let param = 'c55dee33-fd60-4011-a90c-goafaqcbe8sq';
			chai.request(app)
				.get('/posts/' + param + '/comments/')
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(200);
					done();
				});
		});

		it('should not get comments with unavailable post', (done) => {
			let param = 'c55dee33-fd60-4011-a90c-dsaSDF';
			chai.request(app)
				.get('/posts/' + param + '/comments/')
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(500);
					done();
				});
		});
	});

	describe('GET /posts/id/comment/id', () => {
		it('should get specific comment by id', (done) => {
			let param = 'c55dee33-fd60-4011-a90c-goafaqcbe8sq';
			let cid = 'c55dee33-fd60-4011-a90c-b1bssqcbe8sq';
			chai.request(app)
				.get('/posts/' + param + '/comments/' + cid)
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(200);
					done();
				});
		});

		it('should not get comment with wrong id', (done) => {
			let param = 'c55dee33-fd60-4011-a90c-goafaqcbe8sq';
			let cid = 'c55dee33-fd60-4011-a90c-eee';
			chai.request(app)
				.get('/posts/' + param + '/comments/' + cid)
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(404);
					done();
				});
		});
	});

	describe('PATCH /posts/id/comment', () => {
		it('should add a SINGLE comment', (done) => {
			let param = 'c55dee33-fd60-4011-a90c-goafaqcbe8sq';
			chai.request(app)
				.patch('/posts/' + param + '/comment')
				.send({
					author: faker.name.firstName() + ' ' + faker.name.lastName(),
					desc: faker.lorem.text(),
				})
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(200);
					done();
				});
		});

		it('should not add comment with unavailable post', (done) => {
			let param = 'c55dee33-fd60-4011-a90c-dssd';
			chai.request(app)
				.patch('/posts/' + param + '/comment')
				.send({
					author: faker.name.firstName() + ' ' + faker.name.lastName(),
					desc: faker.lorem.text(),
				})
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(500);
					done();
				});
		});

		it('should not add comment with empty data', (done) => {
			let param = 'c55dee33-fd60-4011-a90c-b1bfeacbe8sq';
			chai.request(app)
				.patch('/posts/' + param + '/comment')
				.send({})
				.end((err, res) => {
					expect(res).to.have.status(500);
					done();
				});
		});
	});

	describe('PATCH /posts/id/editcomment/cid', () => {
		it('should update a comment', (done) => {
			let param = 'c55dee33-fd60-4011-a90c-goafaqcbe8sq';
			let cid = 'c55dee33-fd60-4011-a90c-b1bssqcbe8sq';
			chai.request(app)
				.patch('/posts/' + param + '/editcomment/' + cid)
				.send({
					author: faker.name.firstName() + ' ' + faker.name.lastName(),
					desc: faker.lorem.text(),
				})
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(200);
					done();
				});
		});

		it('should not update a comment with wrong id', (done) => {
			let param = 'c55dee33-fd60-4011-a90c-goafaqcbe8sq';
			let cid = 'c55dee33-fd60-4011-a90c-sdsds';
			chai.request(app)
				.patch('/posts/' + param + '/editcomment/' + cid)
				.send({
					author: faker.name.firstName() + ' ' + faker.name.lastName(),
					desc: faker.lorem.text(),
				})
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(404);
					done();
				});
		});

		it('should not update comment with empty data', (done) => {
			let param = 'c55dee33-fd60-4011-a90c-goafaqcbe8sq';
			let cid = 'c55dee33-fd60-4011-a90c-b1bssqcbe8sq';
			chai.request(app)
				.patch('/posts/' + param + '/editcomment/' + cid)
				.send({})
				.end((err, res) => {
					expect(res).to.have.status(404);
					done();
				});
		});
	});

	describe('DELETE /posts/id/comment/cid', () => {
		it('should delete a SINGLE comment', (done) => {
			let param = 'c55dee33-fd60-4011-a90c-goafaqcbe8sq';
			let cid = 'c55dee33-fd60-4011-a90c-b1bssqcbe8sq';
			chai.request(app)
				.patch('/posts/' + param + '/comment/' + cid)
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(200);
					done();
				});
		});

		it('should not delete unavailable comment', (done) => {
			let param = 'c55dee33-fd60-4011-a90c-goafaqcbe8sq';
			let cid = 0;
			chai.request(app)
				.patch('/posts/' + param + '/comment/' + cid)
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(404);
					done();
				});
		});

		it('should not delete comment with unavailable post', (done) => {
			let param = 'c55dee33-fd60-4011-a90c-dfssdf';
			let cid = 0;
			chai.request(app)
				.patch('/posts/' + param + '/comment' + cid)
				.end((err, res) => {
					expect(res).to.have.status(404);
					done();
				});
		});
	});
});
