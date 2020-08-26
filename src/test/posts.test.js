import chai, { expect, assert, should } from 'chai';
should();
import chaiHttp from 'chai-http';
import app from '../index';
import faker from 'faker';
import fs from 'fs';
import path from 'path';
chai.use(chaiHttp);

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
		let param = 'c55dee33-fd60-4011-a90c-b1bfeacbe8ea';
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

// describe('POST /posts', () => {
// 	it('should add a SINGLE post', async (done) => {
// 		try {
// 			const res = await chai
// 				.request(app)
// 				.post('/posts')
// 				.set('Content-Type', 'application/x-www-form-urlencoded')
// 				.field('author', faker.name.firstName() + ' ' + faker.name.lastName())
// 				.field('title', faker.name.title)
// 				.field('desc', faker.lorem.paragraphs)
// 				.attach('cover-imgUrl', fs.readFileSync(path.join(__dirname, '../posts-images/css3.png')), 'css3.png');
// 			expect(res).to.have.status(200);
// 			done();
// 		} catch (e) {
// 			throw e;
// 		}
// 	});
// });

// describe('PUT /posts/id', async () => {
// 	it('should update a SINGLE post with id', async () => {
// 		let param = 'c55dee33-fd60-4011-a90c-b1bfeacbe8ea';
// 		const res = await chai
// 			.request(app)
// 			.put('/posts/' + param)
// 			.set('Content-Type', 'application/x-www-form-urlencoded')
// 			.field('author', faker.name.firstName() + ' ' + faker.name.lastName())
// 			.field('title', faker.name.title)
// 			.field('desc', faker.lorem.paragraphs);
// 		expect(res).to.have.status(200);
// 	});
// });

describe('DELETE /posts/id', () => {
	it('should delete a SINGLE post on /posts/<id> DELETE', () => {
		let param = 'c55dee33-fd60-4011-a90c-b1bfeacbe8ea';
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

// describe('PATCH /posts/id/comment', () => {
// 	it('should add a SINGLE comment', (done) => {
// 		let param = 'c55dee33-fd60-4011-a90c-b1bfeacbe8ea';
// 		chai.request(app)
// 			.patch('/posts/' + param + '/comment')
// 			.send({
// 				author: faker.name.firstName() + ' ' + faker.name.lastName(),
// 				desc: faker.lorem.text(),
// 			})
// 			.end((err, res) => {
// 				if (err) return done(err);
// 				expect(res).to.have.status(200);
// 				done();
// 			});
// 	});

// 	it('should not add comment with empty data', (done) => {
// 		let param = 'c55dee33-fd60-4011-a90c-b1bfeacbe8ea';
// 		chai.request(app)
// 			.patch('/posts/' + param + '/comment')
// 			.send({})
// 			.end((err, res) => {
// 				expect(res).to.have.status(500);
// 				done();
// 			});
// 	});
// });

// describe('DELETE /posts/id/comment/cid', () => {
// 	it('should delete a SINGLE comment', (done) => {
// 		let param = 'c55dee33-fd60-4011-a90c-b1bfeacbe8ea';
// 		let cid = 0;
// 		chai.request(app)
// 			.patch('/posts/' + param + '/comment' + cid)
// 			.end((err, res) => {
// 				if (err) return done(err);
// 				expect(res).to.have.status(200);
// 				done();
// 			});
// 	});

// 	it('should not delete comment with unavailable post', (done) => {
// 		let param = 'c55dee33-fd60-4011-a90c-dfssdf';
// 		let cid = 0;
// 		chai.request(app)
// 			.patch('/posts/' + param + '/comment' + cid)
// 			.end((err, res) => {
// 				expect(res).to.have.status(404);
// 				done();
// 			});
// 	});
// });
