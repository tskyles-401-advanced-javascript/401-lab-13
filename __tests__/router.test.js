'use strict';

const jwt = require('jsonwebtoken');
const {server} = require('../lib/server');
const supergoose = require('@code-fellows/supergoose');
const mockRequest = supergoose(server);

const SECRET = 'Donttellitssecret';

describe('Auth Router', () => {
  let testUser = {
    username: 'test',
    password: 'pass',
  };

  // let badUser = {
  //   username: 'bad',
  //   password: 43,
  // };

  it('can create a user', () => {
    return mockRequest.post('/signup')
      .send(testUser)
      .then(data => {
        // console.log(data);
        let token = jwt.verify(data.text, SECRET);
        expect(token).toBeDefined();
      });
  });
  it('returns all users', () => {
    return mockRequest.get('/users')
      .then(data => {
        expect(data.body.count).toEqual(1);
      });
  });
  it('signs in a user', () => {
    return mockRequest.post('/signin')
      .auth(testUser.username, testUser.password)
      .then(data => {
        let token = jwt.verify(data.text, SECRET);
        expect(token).toBeDefined();
      });
  });
  it('returns invalid on sign in if password is wrong', () => {
    return mockRequest.post('/signin')
      .auth(testUser.username, 'wrongpassword')
      .then(data => {
        expect(data.status).toBe(500);
      });
  });
});

