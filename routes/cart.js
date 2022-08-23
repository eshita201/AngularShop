const express = require('express');
routes = express.Router();
const controller = require('../controller/cart')
routes.post('',controller.addproductstocart)
routes.get('/:id',controller.productsfromcart)
routes.get('/orders/:userid',controller.displayorders)
routes.put('/cartupdate/:userid',controller.updateCart)
routes.get('/cartdelete/:productid/:userid',controller.deletefromCart)
module.exports = routes