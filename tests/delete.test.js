/* eslint-env mocha */

const request = require('supertest');
const chai = require('chai');
const app = require('../index');
const fillData = require('../config/fillDataTest');
const { Auth } = require('../app/models/auth.model');
const db = require('../config/database');

const expect = chai.expect;

chai.config.includeStack = true;

let id = null;
const auth = new Auth('Testtest', 'Test1234', 'test@test.fr');

describe('## Delete', () => {
    before((done) => {
        fillData()
            .then(() => {
                auth.checkIfExist()
                    .then(() => {
                        auth.updateToken()
                            .then((data) => {
                                auth.token = data.token;
                                auth.verifyToken()
                                    .then((dt) => {
                                        id = dt.datas.uuid;
                                        done();
                                    });
                            });
                    });
            });
    });

    it('Should return status 400 and error message for missing token', (done) => {
        request(app)
            .delete(`/api/delete/${id}`)
            .expect({
                httpCode: 400,
                innerException: null,
                isOperational: true,
                message: 'Id or token missing',
                name: 'InvalidInput',
            })
            .expect(400)
            .then(() => {
                done();
            })
            .catch(done);
    });
    it('Should return status 401 and error message for not existing id', (done) => {
        request(app)
            .delete(`/api/delete/${id}test`)
            .set('Authorization', auth.token)
            .expect({
                httpCode: 401,
                innerException: null,
                isOperational: true,
                message: 'Id is not match with this token',
                name: 'Unauthorized',
            })
            .expect(401)
            .then(() => {
                done();
            })
            .catch(done);
    });
    it('Should return status 401 and error message for token expired', (done) => {
        request(app)
            .delete(`/api/delete/${id}`)
            .set('Authorization', `${auth.token}test`)
            .expect({
                httpCode: 401,
                innerException: null,
                isOperational: true,
                message: 'Token is expired',
                name: 'Unauthorized',
            })
            .expect(401)
            .then(() => {
                done();
            })
            .catch(done);
    });
    it('Should return status 200', (done) => {
        request(app)
            .delete(`/api/delete/${id}`)
            .set('Authorization', auth.token)
            .expect(200)
            .then(() => {
                done();
            })
            .catch(done);
    });
    it('Should return status 401 for already deleted', (done) => {
        request(app)
            .delete(`/api/delete/${id}`)
            .set('Authorization', auth.token)
            .expect({
                httpCode: 401,
                innerException: null,
                isOperational: true,
                message: 'This ID not exists or is already deleted',
                name: 'Unauthorized',
            })
            .expect(401)
            .then(() => {
                done();
            })
            .catch(done);
    });
});
