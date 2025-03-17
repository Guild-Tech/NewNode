"use strict";

var _require = require('../models/Product'),
    Product = _require.Product; // Get all products


var getAllProducts = function getAllProducts(req, res) {
  var products;
  return regeneratorRuntime.async(function getAllProducts$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(Product.find());

        case 3:
          products = _context.sent;
          res.status(200).json(products);
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            message: 'Error fetching products',
            error: _context.t0
          });

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
}; // Get a single product by ID


var getProductById = function getProductById(req, res) {
  var product;
  return regeneratorRuntime.async(function getProductById$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(Product.findById(req.params.id));

        case 3:
          product = _context2.sent;

          if (product) {
            _context2.next = 6;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            message: 'Product not found'
          }));

        case 6:
          res.status(200).json(product);
          _context2.next = 12;
          break;

        case 9:
          _context2.prev = 9;
          _context2.t0 = _context2["catch"](0);
          res.status(500).json({
            message: 'Error fetching product',
            error: _context2.t0
          });

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 9]]);
}; // Create a new product


var createProduct = function createProduct(req, res) {
  var newProduct;
  return regeneratorRuntime.async(function createProduct$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          newProduct = new Product(req.body);
          _context3.next = 4;
          return regeneratorRuntime.awrap(newProduct.save());

        case 4:
          res.status(201).json({
            message: 'Product created successfully',
            product: newProduct
          });
          _context3.next = 10;
          break;

        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);
          res.status(400).json({
            message: 'Error creating product',
            error: _context3.t0
          });

        case 10:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 7]]);
}; // Update an existing product


var updateProduct = function updateProduct(req, res) {
  var updatedProduct;
  return regeneratorRuntime.async(function updateProduct$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(Product.findByIdAndUpdate(req.params.id, req.body, {
            "new": true
          }));

        case 3:
          updatedProduct = _context4.sent;

          if (updatedProduct) {
            _context4.next = 6;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            message: 'Product not found'
          }));

        case 6:
          res.status(200).json({
            message: 'Product updated successfully',
            product: updatedProduct
          });
          _context4.next = 12;
          break;

        case 9:
          _context4.prev = 9;
          _context4.t0 = _context4["catch"](0);
          res.status(400).json({
            message: 'Error updating product',
            error: _context4.t0
          });

        case 12:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 9]]);
}; // Delete a product


var deleteProduct = function deleteProduct(req, res) {
  var deletedProduct;
  return regeneratorRuntime.async(function deleteProduct$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(Product.findByIdAndDelete(req.params.id));

        case 3:
          deletedProduct = _context5.sent;

          if (deletedProduct) {
            _context5.next = 6;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            message: 'Product not found'
          }));

        case 6:
          res.status(200).json({
            message: 'Product deleted successfully'
          });
          _context5.next = 12;
          break;

        case 9:
          _context5.prev = 9;
          _context5.t0 = _context5["catch"](0);
          res.status(500).json({
            message: 'Error deleting product',
            error: _context5.t0
          });

        case 12:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

module.exports = {
  getAllProducts: getAllProducts,
  getProductById: getProductById,
  createProduct: createProduct,
  updateProduct: updateProduct,
  deleteProduct: deleteProduct
};