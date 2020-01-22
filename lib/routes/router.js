'use strict';

const express = require('express');
const user = require('../models/user');
// const basicAuth = require('');
// const oAuth = require('');

const router = express.Router();

router.post('/signup', (req, res, next) => {
  user.save(req.body)
    .then(user => {
      let token = user.generateToken(user);
      res.status(200).send(token);
    })
    .catch(error => res.send(error));
});

module.exports = router;