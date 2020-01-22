'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dataModel = require('@tskyles/mongo-model');
const schema = require('../schemas/users-schema');

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
 * @return record with hashed info
 */
  async save(record){
    let {username, password} = record;

    password = await bcrypt.hash(password, 5);
    let hashed = {username: username, password: password};
    await this.post(hashed);
    return record;
  }

  async authenticateBasic(user, pass){

  }

  generateToken(){
    let token = jwt.sign( { username: this.username }, SECRET);
    return token;
  }
}