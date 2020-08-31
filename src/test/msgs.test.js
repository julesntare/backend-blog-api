import chai, { expect, assert, should } from 'chai';
should();
import chaiHttp from 'chai-http';
import app from '../index';
import faker from 'faker';
chai.use(chaiHttp);

let token, msgId;
describe('========== Messages APIs Tests ==========', () => {
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
					done();
				});
		});

		it('should not accept empty body', (done) => {
			chai.request(app)
				.post('/users/register')
				.send({})
				.end((err, res) => {
					expect(res).to.have.status(409);
					done();
				});
		});

		it('should not accept bad firstname', (done) => {
			chai.request(app)
				.post('/users/register')
				.send({
					firstname: 'ds',
					lastname: faker.name.lastName(),
					email: faker.internet.email(),
					password: 'hUhU1!',
					cpassword: 'hUhU1!',
				})
				.end((err, res) => {
					expect(res).to.have.status(403);
					done();
				});
		});

		it('should not accept bad lastname', (done) => {
			chai.request(app)
				.post('/users/register')
				.send({
					firstname: faker.name.firstName(),
					lastname: 's',
					email: faker.internet.email(),
					password: 'hUhU1!',
					cpassword: 'hUhU1!',
				})
				.end((err, res) => {
					expect(res).to.have.status(403);
					done();
				});
		});

		it('should not accept bad email', (done) => {
			chai.request(app)
				.post('/users/register')
				.send({
					firstname: faker.name.firstName(),
					lastname: faker.name.firstName(),
					email: 'dsafs',
					password: 'hUhU1!',
					cpassword: 'hUhU1!',
				})
				.end((err, res) => {
					expect(res).to.have.status(403);
					done();
				});
		});

		it('should not accept bad password', (done) => {
			chai.request(app)
				.post('/users/register')
				.send({
					firstname: faker.name.firstName(),
					lastname: faker.name.firstName(),
					email: faker.internet.email(),
					password: 'ds',
					cpassword: 'hUhU1!',
				})
				.end((err, res) => {
					expect(res).to.have.status(403);
					done();
				});
		});

		it('should not accept unmatch password', (done) => {
			chai.request(app)
				.post('/users/register')
				.send({
					firstname: faker.name.firstName(),
					lastname: faker.name.firstName(),
					email: faker.internet.email(),
					password: 'hUhU1!',
					cpassword: 'hUhUdsa!',
				})
				.end((err, res) => {
					expect(res).to.have.status(403);
					done();
				});
		});
	});

	describe('POST /messages', () => {
		it('should add a SINGLE message', (done) => {
			chai.request(app)
				.post('/messages')
				.send({
					email: faker.internet.email(),
					name: faker.name.firstName() + ' ' + faker.name.lastName(),
					msg: faker.internet.email(),
				})
				.end((err, res) => {
					if (err) return done(err);
					msgId = res.body.msgData._id;
					expect(res).to.have.status(201);
					done();
				});
		});

		it('should not add message with empty data', (done) => {
			chai.request(app)
				.post('/messages')
				.send({})
				.end((err, res) => {
					expect(res).to.have.status(500);
					done();
				});
		});
	});

	describe('GET /messages', () => {
		it('should not allow access to unauthanticated', (done) => {
			chai.request(app)
				.get('/messages')
				.set('authorization', 'sabjkvbskjbasjkvjbaskvjbasvkasbk')
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(401);
					done();
				});
		});

		it('should list ALL messages', (done) => {
			chai.request(app)
				.get('/messages')
				.set('authorization', `Bearer ${token}`)
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(200);
					res.body.should.be.a('array');
					done();
				});
		});
	});

	describe('GET /messages/id', () => {
		it('should list a SINGLE message with id', () => {
			let param = msgId;
			chai.request(app)
				.get('/messages/' + param)
				.set('authorization', `Bearer ${token}`)
				.end((err, res) => {
					expect(res).to.have.status(200);
				});
		});
		it('should not list message with unavailable id', (done) => {
			let param = '5f48239f320eae39146402';
			chai.request(app)
				.get('/messages/' + param)
				.set('authorization', `Bearer ${token}`)
				.end((err, res) => {
					expect(res).to.have.status(404);
					expect(res.body).to.deep.equal({ msg: 'no message available' });
					done();
				});
		});
	});

	describe('DELETE /messages/id', () => {
		it('should delete a SINGLE message with id', () => {
			let param = msgId;
			chai.request(app)
				.delete('/messages/' + param)
				.set('authorization', `Bearer ${token}`)
				.end((err, res) => {
					expect(res).to.have.status(204);
				});
		});

		it('should not delete unavailable message', (done) => {
			const param = '123';
			chai.request(app)
				.delete('/messages/' + param)
				.set('authorization', `Bearer ${token}`)
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(404);
					expect(res.body).to.haveOwnProperty('msg');
					done();
				});
		});
	});
});
