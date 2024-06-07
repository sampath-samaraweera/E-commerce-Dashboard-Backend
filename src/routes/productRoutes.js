// src/routes/productRoutes.js
const express = require('express');
const verifyToken = require('../middlewares/authMiddleware');
const { addProduct, getAllProducts, getProduct, deleteProduct,
    updateProduct,searchProduct, } = require('../controllers/productController');


const router = express.Router();

router.post('/add-product', verifyToken, addProduct);
router.get('/products', verifyToken, getAllProducts);
router.delete('/product/:id', verifyToken, deleteProduct);
router.put('/product/:id', verifyToken, updateProduct);
router.get('/product/:id', verifyToken, getProduct);
router.get('/search/:key', verifyToken, searchProduct);

module.exports = router;
