import chai, { expect, assert, should } from 'chai';
should();
import chaiHttp from 'chai-http';
import app from '../index';
import faker from 'faker';
chai.use(chaiHttp);

describe('========== Messages APIs Tests ==========', () => {
	describe('GET /messages', () => {
		it('should list ALL messages', (done) => {
			chai.request(app)
				.get('/messages')
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
			let param = 'c55dee33-fd60-4011-a90c-b1bfeacbe8ea';
			chai.request(app)
				.get('/messages/' + param)
				.end((err, res) => {
					expect(res).to.have.status(200);
				});
		});
		it('should not list message with unavailable id', (done) => {
			let param = 123;
			chai.request(app)
				.get('/messages/' + param)
				.end((err, res) => {
					expect(res).to.have.status(404);
					expect(res.body).to.deep.equal({ msg: 'no message available' });
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
					expect(res).to.have.status(200);
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

	describe('DELETE /messages/id', () => {
		it('should delete a SINGLE message with id', () => {
			let param = 'c55dee33-fd60-4011-a90c-b1bfeacbe8ea';
			chai.request(app)
				.delete('/messages/' + param)
				.end((err, res) => {
					expect(res).to.have.status(200);
				});
		});

		it('should not delete unavailable message', (done) => {
			const param = 123;
			chai.request(app)
				.delete('/messages/' + param)
				.end((err, res) => {
					if (err) return done(err);
					expect(res).to.have.status(404);
					expect(res.body).to.haveOwnProperty('msg');
					done();
				});
		});
	});
});
