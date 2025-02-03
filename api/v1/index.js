const express = require('express');
const app = express();

const accountEndpoints = require('./account');
const tokenEndpoints = require('./token');

// Use the imported endpoints
app.use('/accounts', accountEndpoints);
app.use('/tokens', tokenEndpoints);

module.exports = app;