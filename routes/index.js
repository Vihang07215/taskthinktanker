const express = require('express');
const routes = express.Router();

const userRoute = require('./userRoute');

routes.use('/user', userRoute);
module.exports = routes;