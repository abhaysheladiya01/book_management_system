const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

router.get('/add-product', adminController.showAddProductForm);

router.get('/products', adminController.createProduct);

router.post('/product', adminController.listProducts);

router.get('/edit-product/:productId', adminController.getEditProduct);

router.post('/edit-product', adminController.updateProduct);

router.post('/delete-product', adminController.deleteProduct);

module.exports = router;