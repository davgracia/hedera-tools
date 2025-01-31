const express = require('express');
const api = require('./api/index.js');

const app = express();
require('dotenv').config();

app.get('/', (req, res) => {
    res.send('Hello World! This is the Hedera Tools project.');
});

app.use('/api', api);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});