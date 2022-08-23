const express = require('express');
routes = express.Router();
const controller = require('../controller/users')
routes.get ('/:id',controller.getUserByid);
routes.post ('/signup',controller.signuser);
routes.post('/login',controller.loginuser);

module.exports = routes