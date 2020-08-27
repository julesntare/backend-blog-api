import chai, { expect, assert, should } from 'chai';
should();
import chaiHttp from 'chai-http';
import app from '../index';
chai.use(chaiHttp);

describe('========== GET main route ==========', () => {
	it('should provide welcome message', (done) => {
		chai.request(app)
			.get('/')
			.end((err, res) => {
				if (err) return done(err);
				expect(res).to.have.status(200);
				done();
			});
	});
});
