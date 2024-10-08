const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    userId: { type: String, required: true },
    company: { type: String, required: true },
    imageUrl: { type: String, required:false },
    description: { type: String, required:false },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
