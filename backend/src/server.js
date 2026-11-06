/* global require, process */

require('dotenv').config();

const app = require('./app');
require('./config/db');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`BrewMatch server running on port ${PORT}`);
});