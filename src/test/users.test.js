import chai, { expect, assert, should } from 'chai';
should();
import chaiHttp from 'chai-http';
import app from '../index';
import faker from 'faker';
import fs from 'fs';
import path from 'path';
chai.use(chaiHttp);

describe('========== Users APIs Tests ==========', () => {
	describe('GET /users', () => {
		it('should list ALL users', (done) => {
			chai.request(app)
				.get('/users')
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
			let param = 'c55dee33-fd60-4011-a90c-b1bfeacbe8ea';
			chai.request(app)
				.get('/users/' + param)
				.end((err, res) => {
					expect(res).to.have.status(200);
				});
		});
		it('should not list user with unavailable id', (done) => {
			let param = 123;
			chai.request(app)
				.get('/users/' + param)
				.end((err, res) => {
					expect(res).to.have.status(404);
					expect(res.body).to.deep.equal({ msg: 'User Not found' });
					done();
				});
		});
	});

	describe('POST /users/register', () => {
		it('should add a SINGLE user', (done) => {
			chai.request(app)
				.post('/users/register')
				.send({
					firstname: faker.name.firstName(),
					lastname: faker.name.lastName(),
					email: faker.internet.email(),
					password: faker.internet.password(),
				})
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(200);
					done();
				});
		});

		it('should not add user with empty data', (done) => {
			chai.request(app)
				.post('/users/register')
				.send({})
				.end((err, res) => {
					expect(res).to.have.status(500);
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

	describe('PUT /users/id', () => {
		it('should update user with id', (done) => {
			let param = 'c55dee33-fd60-4011-a90c-b1bfeacbe8ea';
			chai.request(app)
				.put('/users/' + param)
				.set('Content-Type', 'application/x-www-form-urlencoded')
				.field('firstname', faker.name.firstName())
				.field('lastname', faker.name.lastName())
				.field('email', faker.internet.email())
				.field('bio', 'Software Developer')
				.field('location', faker.address.streetAddress())
				.attach('profile-img-url', fs.readFileSync(path.join(__dirname, '../uploads/css3.png')), 'css3.png')
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(200);
					done();
				});
		});

		it('should update user without image upload', (done) => {
			let param = 'c55dee33-fd60-4011-a90c-b1bfeacbe8ea';
			chai.request(app)
				.put('/users/' + param)
				.set('Content-Type', 'application/x-www-form-urlencoded')
				.field('firstname', faker.name.firstName())
				.field('lastname', faker.name.lastName())
				.field('email', faker.internet.email())
				.field('bio', 'Software Developer')
				.field('location', faker.address.streetAddress())
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(200);
					done();
				});
		});

		it('should not update unavailable user', (done) => {
			let param = 'c55dee33-fd60-4011-a90c-sdfs';
			chai.request(app)
				.put('/users/' + param)
				.set('Content-Type', 'application/x-www-form-urlencoded')
				.field('firstname', faker.name.firstName())
				.field('lastname', faker.name.lastName())
				.field('location', faker.address.streetAddress())
				.attach('profile-img-url', fs.readFileSync(path.join(__dirname, '../uploads/css3.png')), 'css3.png')
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(500);
					done();
				});
		});

		it('should not update user with password', (done) => {
			let param = 'c55dee33-fd60-4011-a90c-b1bfeacbe8ea';
			chai.request(app)
				.put('/users/' + param)
				.set('Content-Type', 'application/x-www-form-urlencoded')
				.field('firstname', faker.name.firstName())
				.field('lastname', faker.name.lastName())
				.field('password', faker.internet.password())
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(404);
					done();
				});
		});
	});

	describe('PUT /users/id/changepass', () => {
		// it("should update user's password", (done) => {
		// 	let param = 'c55dee33-fd60-4011-a90c-b1bfeacbe8ea';
		// 	chai.request(app)
		// 		.put('/users/' + param + '/changepass')
		// 		.send({ currpass: 'hahaha', newpass: 'hihihi', cpass: 'hihihi' })
		// 		.end((err, res) => {
		// 			if (err) return done(err);
		// 			expect(res).to.have.status(200);
		// 			done();
		// 		});
		// });

		it("should not update user's password with unavailable user", (done) => {
			let param = 'c55dee33-fd60-4011-a90c-fsfs';
			chai.request(app)
				.put('/users/' + param + '/changepass')
				.send({ currpass: 'hahaha', newpass: 'hihihi', cpass: 'hihihi' })
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(500);
					done();
				});
		});

		it("should not update user's password with wrong current password", (done) => {
			let param = 'c55dee33-fd60-4011-a90c-b1bfeacbe8ea';
			chai.request(app)
				.put('/users/' + param + '/changepass')
				.send({ currpass: 'fsgssg', newpass: 'hihihi', cpass: 'hihihi' })
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(404);
					done();
				});
		});

		it("should not update user's password with unmatch new password", (done) => {
			let param = 'c55dee33-fd60-4011-a90c-sdfs';
			chai.request(app)
				.put('/users/' + param + '/changepass')
				.send({ currpass: 'hahaha', newpass: 'hihihi', cpass: 'hfhf' })
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(500);
					done();
				});
		});

		it('should not update user with empty data', (done) => {
			let param = 'c55dee33-fd60-4011-a90c-b1bfeacbe8ea';
			chai.request(app)
				.put('/users/' + param + '/changepass')
				.send({})
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(500);
					done();
				});
		});
	});

	describe('DELETE /users/id', () => {
		it('should delete a SINGLE user with id', () => {
			let param = 'c55dee33-fd60-4011-a90c-b1bfeacbe8ea';
			chai.request(app)
				.delete('/users/' + param)
				.end((err, res) => {
					expect(res).to.have.status(200);
				});
		});

		it('should not delete unavailable user', (done) => {
			const param = 123;
			chai.request(app)
				.delete('/users/' + param)
				.end((err, res) => {
					expect(res).to.have.status(404);
					expect(res.body).to.haveOwnProperty('msg');
					done();
				});
		});
	});

	// describe('========== LOGIN Test ==========', () => {
	// 	it('should allow user to login', (done) => {
	// 		chai.request(app)
	// 			.post('/users/login/')
	// 			.set
	// 			.send({ email: 'julesntare@gmail.com', password: 'hihihi' })
	// 			.end((err, res) => {
	// 				if (err) return done(err);
	// 				expect(res).to.have.status(200);
	// 			});
	// 	});
	// });
});
