const express = require('express');
const session = require('express-session');
const useragent = require('express-useragent');

// Load environment variables from .env file
require('dotenv').config();

const app = express();

// Middleware to use sessions with express
app.use(session({
    secret: process.env.SECRET_KEY || 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Middleware to use useragent with express
app.use(useragent.express());

// Middleware to store useragent in session
app.use((req, res, next) => {
    req.session.useragent = req.useragent;
    next();
});

app.get('/', (req, res) => {
    res.send('Hello World! This is the Hedera API project.');
});

// Import the API V1 routes
const apiV1 = require('./api/v1/index.js');

// Use the API V1 routes in the app
app.use('/api/v1', apiV1);

// Define the port to run the server on
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});