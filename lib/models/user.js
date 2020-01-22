'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dataModel = require('@tskyles/mongo-model');
const schema = require('./schemas/users-schema');

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
 * @returns token
 * @memberof User
 */
  generateToken(){
    let token = jwt.sign( { username: this.username }, SECRET);
    return token;
  }
}

module.export = {User};