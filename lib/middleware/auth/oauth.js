'use strict';

require('dotenv').config('../../../.env');

const superagent = require('superagent');
const User = require('../../models/user');

const tokenServer = process.env.TOKEN_SERVER;
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const api_server = process.env.API_SERVER;
const redirect = process.env.REDIRECT;
/**
 *  Oauth authorization module
 * @module authorize
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
module.exports = async function authorize(req, res, next){
  try {
    let code = req.query.code;
    console.log('(1) CODE:', code);

    let remoteToken = await exchangeCodeForToken(code);
    console.log('(2) ACCESS TOKEN:', remoteToken);

    let remoteUser = await getRemoteUserInfo(remoteToken);
    console.log('(3) GITHUB USER', remoteUser);

    let [user, token] = await getUser(remoteUser);
    req.user = user;
    req.token = token;
    console.log('(4) LOCAL USER', user);

    next();
  } catch (e) { next(`ERROR: ${e.message}`); }
};

async function exchangeCodeForToken(code){
  let tokenResponse = await superagent.get(tokenServer)
    .send({
      code: code,
      client_id: client_id,
      client_secret: client_secret,
      redirect: redirect,
      grant_type: 'authorization_code',
    });
  let access_token = tokenResponse.body.access_token;
  return access_token;
}

async function getRemoteUserInfo(token){
  let userResponse = await superagent.get(api_server)
    .set('user-agent', 'express-app')
    .set('Authorization', `token ${token}`);

  let user = userResponse.body;
  return user;
}

async function getUser(remoteUser){
  let userRecord = {
    username: remoteUser.login,
    password: 'oauthpassword',
  };
  
  let user = await User.post(userRecord);
  let token = User.generateToken(user);
  return [user, token];

}



