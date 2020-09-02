import chai, { expect, assert, should } from 'chai';
should();
import chaiHttp from 'chai-http';
import app from '../index';
import User from '../models/users.models';
import faker from 'faker';
import fs from 'fs';
import path from 'path';
chai.use(chaiHttp);

let token, userId, userEmail, userPass;
describe('========== Users APIs Tests ==========', () => {
	before(async () => {
		await User.deleteMany({});
	});
	describe('POST /users/register', () => {
		it('should register new user', (done) => {
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
					userId = res.body.data._id;
					userEmail = res.body.data.email;
					userPass = 'hUhU1!';
					done();
				});
		});

		it('should not add user with taken email', (done) => {
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
					expect(res).to.have.status(409);
					done();
				});
		});

		it('should not add user with empty data', (done) => {
			chai.request(app)
				.post('/users/register')
				.send({})
				.end((err, res) => {
					expect(res).to.have.status(409);
					done();
				});
		});

		it('should not add user with existing email', (done) => {
			chai.request(app)
				.post('/users/register')
				.send({ email: 'julesntare@gmail.com' })
				.end((err, res) => {
					expect(res).to.have.status(409);
					done();
				});
		});

		it('should not add user with bad firstname', (done) => {
			chai.request(app)
				.post('/users/register')
				.send({
					firstname: 'ds',
					lastname: faker.name.lastName(),
					email: 'julesntare@gmail.com',
					password: 'hUhU1!',
					cpassword: 'hUhU1!',
				})
				.end((err, res) => {
					expect(res).to.have.status(400);
					done();
				});
		});

		it('should not add user with bad lastname', (done) => {
			chai.request(app)
				.post('/users/register')
				.send({
					firstname: faker.name.firstName(),
					lastname: 'fd',
					email: 'julesntare@gmail.com',
					password: 'hUhU1!',
					cpassword: 'hUhU1!',
				})
				.end((err, res) => {
					expect(res).to.have.status(400);
					done();
				});
		});

		it('should not add user with bad email', (done) => {
			chai.request(app)
				.post('/users/register')
				.send({
					firstname: faker.name.firstName(),
					lastname: faker.name.lastName(),
					email: 'julesntare',
					password: 'hUhU1!',
					cpassword: 'hUhU1!',
				})
				.end((err, res) => {
					expect(res).to.have.status(400);
					done();
				});
		});

		it('should not add user with weak password', (done) => {
			chai.request(app)
				.post('/users/register')
				.send({
					firstname: faker.name.firstName(),
					lastname: faker.name.lastName(),
					email: 'julesntare@gmail.com',
					password: 'sdfbgh',
					cpassword: 'hUhU1!',
				})
				.end((err, res) => {
					expect(res).to.have.status(400);
					done();
				});
		});

		it('should not add user with unmatching password', (done) => {
			chai.request(app)
				.post('/users/register')
				.send({
					firstname: faker.name.firstName(),
					lastname: faker.name.lastName(),
					email: 'julesntare@gmail.com',
					password: 'hUhU1!',
					cpassword: 'dfgsgs',
				})
				.end((err, res) => {
					expect(res).to.have.status(400);
					done();
				});
		});
	});

	describe('LOGIN /users/login', () => {
		it('should login successful', (done) => {
			chai.request(app)
				.post('/users/login')
				.send({ email: userEmail, password: userPass })
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(200);
					done();
				});
		});

		it('should not login with empty data', (done) => {
			chai.request(app)
				.post('/users/login')
				.send({})
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(409);
					done();
				});
		});

		it('should not login with unavailable email', (done) => {
			chai.request(app)
				.post('/users/login')
				.send({ email: 'patu@gmail.com', password: userPass })
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(404);
					done();
				});
		});

		it('should not login with invalid password', (done) => {
			chai.request(app)
				.post('/users/login')
				.send({ email: userEmail, password: 'huUUUU1@' })
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(404);
					done();
				});
		});

		it('should not login when there is valid token', (done) => {
			chai.request(app)
				.post('/users/login')
				.set('authorization', `Bearer ${token}`)
				.send({ email: userEmail, password: userPass })
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(401);
					done();
				});
		});
	});

	describe('GET /users', () => {
		it('should list ALL users', (done) => {
			chai.request(app)
				.get('/users')
				.set('authorization', `Bearer ${token}`)
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(200);
					res.body.should.be.a('array');
					done();
				});
		});
	});

	describe('GET /users/id', () => {
		it('should list a SINGLE user with id', () => {
			let param = userId;
			chai.request(app)
				.get('/users/' + param)
				.set('authorization', `Bearer ${token}`)
				.end((err, res) => {
					expect(res).to.have.status(200);
				});
		});

		it('should list a SINGLE user with null result', () => {
			let param = '5ea76989e41a4c2b3cf3ef19';
			chai.request(app)
				.get('/users/' + param)
				.set('authorization', `Bearer ${token}`)
				.end((err, res) => {
					expect(res).to.have.status(404);
				});
		});

		it('should not list user with unavailable id', (done) => {
			let param = 123;
			chai.request(app)
				.get('/users/' + param)
				.set('authorization', `Bearer ${token}`)
				.end((err, res) => {
					expect(res).to.have.status(404);
					expect(res.body).to.deep.equal({ msg: 'User Not found' });
					done();
				});
		});
	});

	describe('PUT /users/id', () => {
		it('should update user with id', (done) => {
			let param = userId;
			chai.request(app)
				.put('/users/' + param)
				.set('Content-Type', 'application/x-www-form-urlencoded')
				.set('authorization', `Bearer ${token}`)
				.send({ firstname: faker.name.firstName() })
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(200);
					done();
				});
		});

		it('should update user with image', (done) => {
			let param = userId;
			chai.request(app)
				.put('/users/' + param)
				.type('form')
				.set('authorization', `Bearer ${token}`)
				.set('Content-Type', 'multipart/form-data')
				.field('firstname', faker.name.firstName())
				.attach(
					'profile-img-url',
					fs.readFileSync(path.join(__dirname, '../posts-images/css3.png')),
					'css3.png'
				)
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(200);
					done();
				});
		});

		it('should not add user with bad firstname', (done) => {
			let param = userId;
			chai.request(app)
				.put('/users/' + param)
				.set('authorization', `Bearer ${token}`)
				.send({
					firstname: '23',
					lastname: faker.name.lastName(),
					email: 'julesntare@gmail.com',
					password: 'hUhU1!',
					cpassword: 'hUhU1!',
				})
				.end((err, res) => {
					expect(res).to.have.status(400);
					done();
				});
		});

		it('should not add user with bad lastname', (done) => {
			let param = userId;
			chai.request(app)
				.put('/users/' + param)
				.set('authorization', `Bearer ${token}`)
				.send({
					firstname: faker.name.firstName(),
					lastname: 'fd',
					email: 'julesntare@gmail.com',
					password: 'hUhU1!',
					cpassword: 'hUhU1!',
				})
				.end((err, res) => {
					expect(res).to.have.status(400);
					done();
				});
		});

		it('should not add user with bad email', (done) => {
			let param = userId;
			chai.request(app)
				.put('/users/' + param)
				.set('authorization', `Bearer ${token}`)
				.send({
					firstname: faker.name.firstName(),
					lastname: faker.name.lastName(),
					email: 'julesntare',
					password: 'hUhU1!',
					cpassword: 'hUhU1!',
				})
				.end((err, res) => {
					expect(res).to.have.status(400);
					done();
				});
		});

		it('should not update user with empty data', (done) => {
			let param = userId;
			chai.request(app)
				.put('/users/' + param)
				.set('Content-Type', 'application/x-www-form-urlencoded')
				.set('authorization', `Bearer ${token}`)
				.send({})
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(400);
					done();
				});
		});

		it('should not update unavailable user', (done) => {
			let param = '5f4c4af1698f42216477d6a7';
			chai.request(app)
				.put('/users/' + param)
				.set('Content-Type', 'application/x-www-form-urlencoded')
				.set('authorization', `Bearer ${token}`)
				.send({ firstname: faker.name.firstName() })
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(404);
					done();
				});
		});
	});

	describe('DELETE /users/id', () => {
		it('should delete a SINGLE user with id', () => {
			let param = userId;
			chai.request(app)
				.delete('/users/' + param)
				.set('authorization', `Bearer ${token}`)
				.end((err, res) => {
					expect(res).to.have.status(204);
				});
		});

		it('should not delete a SINGLE user with null result', () => {
			let param = '5ea76989e41a4c2b3cf3ef19';
			chai.request(app)
				.delete('/users/' + param)
				.set('authorization', `Bearer ${token}`)
				.end((err, res) => {
					expect(res).to.have.status(404);
				});
		});

		it('should not delete user with wrong id format', () => {
			let param = 'fsafs';
			chai.request(app)
				.delete('/users/' + param)
				.set('authorization', `Bearer ${token}`)
				.end((err, res) => {
					expect(res).to.have.status(404);
				});
		});
	});
});
