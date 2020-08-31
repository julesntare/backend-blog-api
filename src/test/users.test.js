import chai, { expect, assert, should } from 'chai';
should();
import chaiHttp from 'chai-http';
import app from '../index';
import faker, { fake } from 'faker';
import fs from 'fs';
import path from 'path';
chai.use(chaiHttp);

let token, userId;
describe('========== Users APIs Tests ==========', () => {
	describe('POST /users/register', () => {
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
					userId = res.body.data._id;
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
	});
});
