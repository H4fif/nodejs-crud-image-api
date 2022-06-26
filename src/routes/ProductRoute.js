const express = require('express');

const {
  getProducts,
  getProductById,
  saveProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/ProductController');

const router = express.Router();

router.get('/products', getProducts);
router.post('/products', saveProduct);
router.get('/products/:id', getProductById);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

module.exports = router;