require('dotenv').config();
const express = require('express');
const routes = require('./src/routes/routes');
const app = express();
const Port = 8080;

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse x-www-form-urlencoded bodies
app.use(express.urlencoded({ extended: true }));

//Handles routes in the app
app.use('/api', routes);

app.listen(Port, () => console.log(`Listening to port ${Port}`));
