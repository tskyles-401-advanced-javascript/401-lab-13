'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dataModel = require('@tskyles/mongo-model');
const schema = require('./schemas/user');

let SECRET = 'Donttellitssecret';


/**
 * @class User
 * @extends {dataModel}
 */
class User extends dataModel{
  constructor(){
    super(schema);
  }

  /**
 * save user to DB with hashed password
 * @param {*} record
 * @memberof User
 * @returns record
 */
  async save(record){
    let {username, password} = record;

    password = await bcrypt.hash(password, 5);
    let hashed = {username: username, password: password};
    await this.post(hashed);
    return record;
  }
  /**
 * Compare user to database and return if valid
 * @param {*} user
 * @param {*} pass
 * @memberof User
 * @returns user if password is valid
 */

  async authenticateBasic(user, pass){
    let dbUser = await schema.find({username: user});
    let userPass = dbUser[0].password;

    let validPassword = await bcrypt.compare(pass, userPass);
    return validPassword? user: Promise.reject();
  }
  /**
 * @param {*} token
 * @returns Promise
 * @memberof User
 */
  async authenticateToken(token){
    try {
      let parsedTokenObject = jwt.verify(token, SECRET);
      console.log('parsed token obj', parsedTokenObject);
      if(schema.find({username: parsedTokenObject.username})){
        return Promise.resolve(parsedTokenObject);
      }
      else {
        return Promise.reject();
      }
    }
    catch(error) {
      return Promise.reject();
    }
  }

  /**
 * Generate token
 * @returns token
 * @memberof User
 */
  generateToken(user, expiresInSeconds){
    if(expiresInSeconds){
      let token = jwt.sign( { username: user.username }, SECRET, {expiresIn: expiresInSeconds});
      return token;
    }
    else {
      let token = jwt.sign( { username: user.username }, SECRET);
      return token;
    }
  }
}

module.exports = new User();