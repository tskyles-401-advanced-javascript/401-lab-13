'use strict';

const User = require('../../models/user');
/** 
 * @module bearerAuth
*/
module.exports = (req, res, next) => {
  if(!req.headers.authorization){
    next('Invalid Login'); 
    return; 
  }
  let token = req.headers.authorization.split(' ').pop();
  User.authenticateToken(token)
    .then(validUser => {
      req.user = validUser;
      next();
    })
    .catch(error => next('Invalid Login'));
};