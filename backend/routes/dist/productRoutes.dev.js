"use strict";

var express = require('express');

var router = express.Router();

var productController = require('../controllers/productController');

router.get('/products', productController.getAllProducts);
router.get('/products/:id', productController.getProductById);
router.post('/products', productController.createProduct);
router.put('/products/:id', productController.updateProduct);
router["delete"]('/products/:id', productController.deleteProduct);
module.exports = router;