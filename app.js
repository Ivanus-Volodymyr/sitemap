const path = require('path');

require('dotenv').config({path: path.join(process.cwd(), 'environments', '.env')});

const {constants} = require('./config');

const express = require('express');

const app = express();

const {siteMapRouter} = require('./routes');

app.use('/sitemap', siteMapRouter);

app.use('*', (req, res) => {
    res.status(404).json('Route not found');
});

app.listen(constants.PORT, () => {
    console.log(`Started on port ${constants.PORT}`);
});
