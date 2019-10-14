/* eslint-env mocha */

const request = require('supertest');
const chai = require('chai');
const app = require('../index');
const db = require('../config/database');
const fillData = require('../config/fillDataTest');

const expect = chai.expect;

chai.config.includeStack = true;

describe('## Register', () => {
    before((done) => {
        fillData()
            .then(() => done());
    });

    it('Should return status 400 and error message for email missing', (done) => {
        request(app)
            .post('/api/register')
            .send({ username: 'TestWithMocha', password: 'Test1234' }) // Missing email
            .expect({
                httpCode: 400,
                innerException: null,
                isOperational: true,
                message: 'You have to send email',
                name: 'InvalidInput',
            })
            .expect(400)
            .then(() => {
                done();
            })
            .catch(done);
    });

    it('Should return status 400 and error message for username missing', (done) => {
        request(app)
            .post('/api/register')
            .send({ email: 'testmocha@test.fr', password: 'Test1234' }) // Missing username
            .expect({
                httpCode: 400,
                innerException: null,
                isOperational: true,
                message: 'You have to send username',
                name: 'InvalidInput',
            })
            .expect(400)
            .then(() => {
                done();
            })
            .catch(done);
    });

    it('Should return status 400 and error message for password missing', (done) => {
        request(app)
            .post('/api/register')
            .send({ email: 'testmocha@test.fr', username: 'TestWithMocha' }) // Missing password
            .expect({
                httpCode: 400,
                innerException: null,
                isOperational: true,
                message: 'You have to send password',
                name: 'InvalidInput',
            })
            .expect(400)
            .then(() => {
                done();
            })
            .catch(done);
    });

    it('Should return status 400 and error message for wrong email', (done) => {
        request(app)
            .post('/api/register')
            .send({ email: 'testtest.fr', username: 'TestWithMocha', password: 'Test1234' }) // Wrong email
            .expect({
                httpCode: 400,
                innerException: null,
                isOperational: true,
                message: '"email" must be a valid email',
                name: 'InvalidInput',
            })
            .expect(400)
            .then(() => {
                done();
            })
            .catch(done);
    });

    it('Should return status 400 and error message for wrong username', (done) => {
        request(app)
            .post('/api/register')
            .send({ email: 'testmocha@test.fr', username: 'Test', password: 'Test1234' }) // Wrong username
            .expect({
                httpCode: 400,
                innerException: null,
                isOperational: true,
                message: '"username" length must be at least 5 characters long',
                name: 'InvalidInput',
            })
            .expect(400)
            .then(() => {
                done();
            })
            .catch(done);
    });

    it('Should return status 400 and error message for wrong username', (done) => {
        request(app)
            .post('/api/register')
            .send({ email: 'testmocha@test.fr', username: 'TestTestTestTestTestTestTestTest', password: 'Test1234' }) // Wrong username
            .expect({
                httpCode: 400,
                innerException: null,
                isOperational: true,
                message: '"username" length must be less than or equal to 30 characters long',
                name: 'InvalidInput',
            })
            .expect(400)
            .then(() => {
                done();
            })
            .catch(done);
    });

    it('Should return status 400 and error message for wrong password', (done) => {
        request(app)
            .post('/api/register')
            .send({ email: 'testmocha@test.fr', username: 'TestWithMocha', password: 'test' }) // Wrong password
            .expect({
                httpCode: 400,
                innerException: null,
                isOperational: true,
                message: '"password" with value "test" fails to match the required pattern: /^[a-zA-Z0-9]{5,30}$/',
                name: 'InvalidInput',
            })
            .expect(400)
            .then(() => {
                done();
            })
            .catch(done);
    });

    it('Should return status 200', (done) => {
        request(app)
            .post('/api/register')
            .send({ email: 'testmocha@test.fr', username: 'TestWithMocha', password: 'Test1234' })
            .expect({
                httpCode: 200,
                data: {
                    success: 'success',
                },
            })
            .expect(200)
            .then(() => {
                done();
            })
            .catch(done);
    });

    it('Should return status 400 with already register error', (done) => {
        request(app)
            .post('/api/register')
            .send({ email: 'testmocha@test.fr', username: 'TestWithMocha', password: 'Test1234' })
            .expect({
                httpCode: 400,
                innerException: null,
                isOperational: true,
                message: 'Username or Email are already registers',
                name: 'InvalidInput',
            })
            .expect(400)
            .then(() => {
                done();
            })
            .catch(done);
    });
});
