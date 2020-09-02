import chai, { expect, assert, should } from 'chai';
should();
import chaiHttp from 'chai-http';
import app from '../index';
import User from '../models/users.models';
import Post from '../models/posts.models';
import Comment from '../models/comments.models';
import faker from 'faker';
chai.use(chaiHttp);

let token, postId, cId;
describe('========== Comments APIs Tests ==========', () => {
	before(async () => {
		await User.deleteMany({});
		await Post.deleteMany({});
		await Comment.deleteMany({});
	});
	describe('POST /posts/register', () => {
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

		it('should add a SINGLE comment over a given post', (done) => {
			chai.request(app)
				.post('/posts/' + postId + '/comment')
				.set('authorization', `Bearer ${token}`)
				.send({ author: 'julesntare@gmail.com', postId: postId, desc: faker.lorem.paragraph() })
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(200);
					cId = res.body.data._id;
					done();
				});
		});

		it('should not add comment with empty data', (done) => {
			chai.request(app)
				.post('/posts/' + postId + '/comment')
				.set('authorization', `Bearer ${token}`)
				.send({})
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(409);
					done();
				});
		});
	});

	describe('GET /posts/id/comments', () => {
		it('should get comments', (done) => {
			chai.request(app)
				.get('/posts/' + postId + '/comments')
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(200);
					done();
				});
		});
	});

	describe('GET /posts/id/comments/cid', () => {
		it('should get comment by id', (done) => {
			chai.request(app)
				.get('/posts/' + postId + '/comments/' + cId)
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(200);
					done();
				});
		});
	});

	describe('PUT /posts/id/editcomment/cid', () => {
		it('should update comment', () => {
			chai.request(app)
				.put('/posts/' + postId + '/editcomment/' + cId)
				.set('authorization', `Bearer ${token}`)
				.send({ desc: 'keep it' })
				.end((err, res) => {
					expect(res).to.have.status(200);
				});
		});

		it('should not update comment with empty data', () => {
			chai.request(app)
				.put('/posts/' + postId + '/editcomment/' + cId)
				.set('authorization', `Bearer ${token}`)
				.send({})
				.end((err, res) => {
					expect(res).to.have.status(409);
				});
		});

		it('should not update comment with bad id', () => {
			chai.request(app)
				.put('/posts/' + postId + '/editcomment/' + '1331ds')
				.set('authorization', `Bearer ${token}`)
				.send({ desc: 'hello' })
				.end((err, res) => {
					expect(res).to.have.status(404);
				});
		});
	});

	describe('DELETE /posts/id/comment/cid', () => {
		it('should delete comment with id', () => {
			chai.request(app)
				.delete('/posts/' + postId + '/comment/' + cId)
				.set('authorization', `Bearer ${token}`)
				.end((err, res) => {
					expect(res).to.have.status(204);
				});
		});

		it('should not delete comment with bad id', () => {
			chai.request(app)
				.delete('/posts/' + postId + '/comment/22dw')
				.set('authorization', `Bearer ${token}`)
				.end((err, res) => {
					expect(res).to.have.status(404);
				});
		});
	});
});
