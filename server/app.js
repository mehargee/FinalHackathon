const dotenv = require('dotenv');
const mongoos = require('mongoose');
const express = require("express");
const cookieParser = require('cookie-parser');
const app = express();
dotenv.config({ path: './config.env' });

require('./db/conn');

// Use middleware to store cookies
app.use(cookieParser());

// Read data in JSON format
app.use(express.json());

// All routes are defined in this file
app.use(require('./router/auth'));



const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});
