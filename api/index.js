const express = require('express');
const app = express();

const accountEndpoints = require('./account');
const tokenEndpoints = require('./token');

// Use the imported endpoints
app.use('/account', accountEndpoints);
app.use('/token', tokenEndpoints);

module.exports = app;