/* eslint-env mocha */

const request = require('supertest');
const chai = require('chai');
const app = require('../index');
const db = require('../config/database');
const fillData = require('../config/fillDataTest');

const expect = chai.expect;

chai.config.includeStack = true;

describe('## Login', () => {
    before((done) => {
        fillData()
            .then(() => done());
    });

    console.info('start login');
    it('Should return status 400 and error message for email and username missing', (done) => {
        request(app)
            .post('/api/login')
            .send({ password: 'Test1234' }) // Missing email and username
            .expect({
                httpCode: 400,
                innerException: null,
                isOperational: true,
                message: 'You have to send email or username',
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
            .post('/api/login')
            .send({ email: 'test@test.fr' }) // Missing password
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
            .post('/api/login')
            .send({ email: 'testtest.fr', password: 'Test1234' }) // Wrong email
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
            .post('/api/login')
            .send({ username: 'Test', password: 'Test1234' }) // Wrong username
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
            .post('/api/login')
            .send({ username: 'TestTestTestTestTestTestTestTest', password: 'Test1234' }) // Wrong username
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
            .post('/api/login')
            .send({ email: 'test@test.fr', password: 'test' }) // Wrong password
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
    it('Should return status 400 and error message for incorrect username / Email', (done) => {
        request(app)
            .post('/api/login')
            .send({ email: 'testtest@test.fr', password: 'Test1234' })
            .expect({
                httpCode: 400,
                innerException: null,
                isOperational: true,
                message: 'Username / Email with password is incorrect',
                name: 'InvalidInput',
            })
            .expect(400)
            .then(() => {
                done();
            })
            .catch(done);
    });
    it('Should return status 400 and error message for incorrect password', (done) => {
        request(app)
            .post('/api/login')
            .send({ username: 'Testtest', password: 'Test12345' })
            .expect({
                httpCode: 400,
                innerException: null,
                isOperational: true,
                message: 'Password is incorrect',
                name: 'InvalidInput',
            })
            .expect(400)
            .then(() => {
                done();
            })
            .catch(done);
    });
    it('Should return status 200 to connect with email', (done) => {
        request(app)
            .post('/api/login')
            .send({ email: 'test@test.fr', username: null, password: 'Test1234' })
            .expect(200)
            .then(() => {
                done();
            })
            .catch(done);
    });
    it('Should return status 200 to connect with username', (done) => {
        request(app)
            .post('/api/login')
            .send({ email: null, username: 'Testtest', password: 'Test1234' })
            .expect(200)
            .then(() => {
                done();
            })
            .catch(done);
    });
});
