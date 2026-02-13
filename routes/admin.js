const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/add-product', isAuth, adminController.showAddProductForm);

router.get('/products', isAuth, adminController.createProduct);

router.post('/product', isAuth, adminController.listProducts);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product', isAuth, adminController.updateProduct);

router.post('/delete-product', isAuth, adminController.deleteProduct);

module.exports = router;
