const express = require('express');
const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');
const { productValidation } = require('../middleware/validators');

const router = express.Router();

router.get('/add-product', isAuth, adminController.showAddProductForm);
router.get('/products', isAuth, adminController.createProduct);

router.post('/product', isAuth, productValidation, adminController.listProducts);
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);
router.post('/edit-product', isAuth, productValidation, adminController.updateProduct);

router.post('/delete-product', isAuth, adminController.deleteProduct);

module.exports = router;
