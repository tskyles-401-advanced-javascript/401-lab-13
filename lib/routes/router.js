'use strict';

const express = require('express');
const User = require('../models/user');
const basicAuth = require('../middleware/auth/basicAuth');
const oauth = require('../middleware/auth/oauth');

const router = express.Router();

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

router.get('/oauth', oauth, (req, res) => {
  res.status(200).send(req.token);
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


module.exports = router;