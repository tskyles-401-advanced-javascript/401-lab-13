'use strict';

const User = require('../../models/user');

module.exports = (req, res, next) => {
  if(!req.headers.authorization){
    next('Invalid Login'); 
    return; 
  }
  console.log('req.headers', req.headers.authorization);
  let token = req.headers.authorization.split(' ').pop();
  console.log('token', token);
  User.authenticateToken(token)
    .then(validUser => {
      req.user = validUser;
      next();
    })
    .catch(error => next('Invalid Login'));
};