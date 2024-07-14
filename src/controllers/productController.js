const Product = require('../models/Product');
const cloudinary = require('../utils/cloudinaryConfig');

const addProduct = async (req, resp) => {
    try {
        let fileUrl = '';
        if (req.file) {
            // Upload file to Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path);
            fileUrl = result.secure_url;
        }

        let productData = { ...req.body, imageUrl: fileUrl };
        let product = new Product(productData);
        let result = await product.save();
        resp.status(201).json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error("Error while adding product:", error);
        resp.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

const getAllProducts = async (req, resp) => {
    try {
        let products = await Product.find();
        resp.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        console.error("Error while fetching products:", error);
        resp.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

const deleteProduct = async (req, resp) => {
    try {
        let result = await Product.deleteOne({_id:req.params.id});
        if (result.deletedCount > 0) {
            resp.status(201).json({
                success: true,
                data: result
            })            
        }
        else{
            resp.status(400).json({
                success: false,
                data: result
            })
        }

    }
    catch (error) {
        console.error("Error while deleting product:", error);
        resp.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }

};

const updateProduct = async (req, resp) => {
    try{
        let product = await Product.updateOne(
            {_id: req.params.id},
            { $set: req.body}
        )
        resp.status(200).json({
            success: true,
            data: product
        })
    }
    catch(error){
        console.error("Error while updating product:", error);
        resp.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }

};

const getProduct= async (req, resp) => {
    try{
        let product = await Product.findOne({_id:req.params.id});
        if (product){
            resp.status(200).json({
                success: true,
                data: product
            })
        }
        else{
            resp.status(404).json({
                success: false,
                data: product
            })
        }
    }
    catch(error){
        resp.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }

};

const searchProduct = async (req, resp) => {
    try{
        let result = await Product.find({
            "$or":[
                { name: { $regex: req.params.key, $options: 'i' } },
                { company: { $regex: req.params.key, $options: 'i' } },
                { category: { $regex: req.params.key, $options: 'i' } }
            ]
        })
        if (result.length > 0 ) {
            resp.status(200).json({
                success: true,
                data: result
            })
        }else {
            resp.status(200).json({
                success: true,
                data: result
            })
        }
    }
    catch(error){
        console.error("Error while fetching data from api:", error);
        resp.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }

};

module.exports = { 
    addProduct, 
    getAllProducts, 
    getProduct,
    deleteProduct,
    updateProduct,
    searchProduct,
};
