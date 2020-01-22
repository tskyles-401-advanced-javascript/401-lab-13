'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

//bring in handlers

//bring in router

const app = express();

app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static('./public'));

//need app to use router

/** 
 * @module server
*/
const server = {
  server: app,
  start: port => {
    let PORT = port || 3000;
    app.listen( PORT => console.log(`server is listening on PORT `${PORT}));
  }
}

module.exports = server;