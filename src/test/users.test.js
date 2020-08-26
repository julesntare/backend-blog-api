import chai, { expect, assert, should } from 'chai';
should();
import chaiHttp from 'chai-http';
import app from '../index';
import faker from 'faker';
chai.use(chaiHttp);

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
});

describe('PUT /users/id', () => {
	it('should update a SINGLE user with id', (done) => {
		let param = 'c55dee33-fd60-4011-a90c-b1bfeacbe8ea';
		chai.request(app)
			.put('/users/' + param)
			.send({
				firstname: faker.name.firstName(),
				lastname: faker.name.lastName(),
				email: faker.internet.email(),
				bio: 'Software Developer',
				location: 'Rwanda, Kigali KN 88st',
				links: 'https://facebook.com/JohnDoe',
				'profile-img-url': faker.random.image(),
			})
			.end((err, res) => {
				if (err) return done(err);
				expect(res).to.have.status(200);
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
