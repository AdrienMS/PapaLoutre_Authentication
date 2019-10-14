/* eslint-env mocha */

const request = require('supertest');
const chai = require('chai');
const app = require('../index');
const fillData = require('../config/fillDataTest');
const { Auth } = require('../app/models/auth.model');

const expect = chai.expect;

chai.config.includeStack = true;

let token = null;
const auth = new Auth('Testtest', 'Test1234', 'test@test.fr');

describe('## Verify JWT', () => {
    before((done) => {
        fillData()
            .then(() => {
                auth.checkIfExist()
                    .then(() => {
                        auth.updateToken()
                            .then((data) => {
                                token = data.token;
                                done();
                            });
                    });
            });
    });

    it('Should return status 400 and error for missing token', (done) => {
        request(app)
            .get('/api/verify')
            .expect({
                httpCode: 400,
                innerException: null,
                isOperational: true,
                message: 'Token is empty',
                name: 'InvalidInput',
            })
            .expect(400)
            .then(() => {
                done();
            })
            .catch(done);
    });
    it('Should return status 401 and error message for expired token', (done) => {
        request(app)
            .get('/api/verify')
            .set('Authorization', `${token}test`)
            .expect({
                httpCode: 401,
                innerException: null,
                isOperational: true,
                message: 'The token is expired',
                name: 'Unauthorized',
            })
            .expect(401)
            .then(() => {
                done();
            })
            .catch(done);
    });
    it('Should return status 200 for valid token', (done) => {
        request(app)
            .get('/api/verify')
            .set('Authorization', token)
            .expect(200)
            .then(() => {
                done();
            })
            .catch(done);
    });
});
