'use strict';

const base64 = require('base-64');
const User = require('../../models/user');

module.exports = (req, res, next) => {
  if(!req.headers.authorization){
    next('Invalid Login');
    return;
  }

  let basic = req.headers.authorization.split(' ').pop();

  let [user, pass] = base64.decode(basic).split(':');

  User.authenticateBasic(user, pass)
    .then(validUser => {
      req.toke = User.generateToken(validUser);
      next();
    })
    .catch(err => next('Invalid Username/Password'));
};