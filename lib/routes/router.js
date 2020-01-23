'use strict';
// swagger
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../../docs/config/swagger.json');

const express = require('express');
const User = require('../models/user');
const basicAuth = require('../middleware/auth/basicAuth');
const oauth = require('../middleware/auth/oauth');
const bearerAuth = require('../middleware/auth/bearerAuth');
const acl = require('../middleware/acl/acl');

const router = express.Router();

router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument));
router.use('/docs', express.static('docs'));

router.get('/users', (req, res, next) => {
  User.get()
    .then(data => {
      const output = {
        count: data.length,
        results: data,
      };
      res.status(200).send(output);
    });
});

router.get('/user', bearerAuth, (req, res, next) => {
  res.status(200).json(req.user);
});

router.get('/oauth', oauth, (req, res) => {
  res.status(200).send(req.token);
});

router.get('/create', bearerAuth, acl('create'), (req, res, next) => {
  res.status(200).send('Create OK');
});

router.get('/update', bearerAuth, acl('update'), (req, res, next) => {
  res.status(200).send('Update OK');
});

router.get('/delete', bearerAuth, acl('delete'), (req, res, next) => {
  res.status(200).send('Delete OK');
});

router.post('/signup', (req, res, next) => {
  User.save(req.body)
    .then(user => {
      let token = User.generateToken(user);
      res.status(200).send(token);
    })
    .catch(error => res.send(error));
});

router.post('/signin', basicAuth, (req, res, next) => {
  res.status(200).send(req.token);
});

/** 
 * @module router
*/
module.exports = router;