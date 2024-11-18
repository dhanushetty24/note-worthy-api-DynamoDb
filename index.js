require('dotenv').config();
const express = require('express');
const app = express();
require('./src/config/config'); // Importing database connection when server starts
const routes = require('./src/routes/routes');
const Port = process.env.PORT || 8080;
require('./src/model/jotgle.schema')


// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse x-www-form-urlencoded bodies
app.use(express.urlencoded({ extended: true }));

//Handles routes in the app
app.use('/api', routes);

app.listen(Port, () => console.log(`Listening to port ${Port}`));
