// src/routes/productRoutes.js
const express = require('express');
const multer = require('multer');
const verifyToken = require('../middlewares/authMiddleware');
const { addProduct, getAllProducts, getProduct, deleteProduct,
    updateProduct,searchProduct, getMyProducts, checkoutProduct  } = require('../controllers/productController');

const upload = multer({ dest: 'uploads/' }); // This saves files to the 'uploads' folder

const router = express.Router();

router.post('/add-product', verifyToken, upload.single('image'), addProduct);
router.get('/getAll', getAllProducts);
router.delete('/product/:productId', verifyToken, deleteProduct);
router.put('/product/:productId', verifyToken, upload.single('image'), updateProduct);
router.get('/product/:productId', getProduct);
router.get('/search/:key', searchProduct);
router.get('/myProduct/:userId', verifyToken, getMyProducts);
router.post('/checkout', checkoutProduct)

module.exports = router;
