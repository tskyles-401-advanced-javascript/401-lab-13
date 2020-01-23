'use strict';

const base64 = require('base-64');
const User = require('../../models/user');
/**
 * authenticates user with basic auth
 * @module basicAuth
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns token for valid user
 */
module.exports = (req, res, next) => {
  if(!req.headers.authorization){
    next('Invalid Login');
    return;
  }

  let basic = req.headers.authorization.split(' ').pop();

  let [user, pass] = base64.decode(basic).split(':');

  User.authenticateBasic(user, pass)
    .then(validUser => {
      req.token = User.generateToken(validUser);
      next();
    })
    .catch(err => next('Invalid Username/Password'));
};