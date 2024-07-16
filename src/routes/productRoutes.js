// src/routes/productRoutes.js
const express = require('express');
const multer = require('multer');
const verifyToken = require('../middlewares/authMiddleware');
const { addProduct, getAllProducts, getProduct, deleteProduct,
    updateProduct,searchProduct, getMyProducts  } = require('../controllers/productController');

const upload = multer({ dest: 'uploads/' }); // This saves files to the 'uploads' folder


const router = express.Router();

router.post('/add-product', verifyToken, upload.single('image'), addProduct);
router.get('/getAll', verifyToken, getAllProducts);
router.delete('/product/:productId', verifyToken, deleteProduct);
router.put('/product/:productId', verifyToken, upload.single('image'), updateProduct);
router.get('/product/:productId', verifyToken, getProduct);
router.get('/search/:key', verifyToken, searchProduct);
router.get('/myProduct/:userId', verifyToken, getMyProducts);

module.exports = router;
