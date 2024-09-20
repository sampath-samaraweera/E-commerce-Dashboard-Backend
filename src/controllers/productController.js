const Product = require('../models/Product');
const cloudinary = require('../utils/cloudinaryConfig');
const stripe = require("stripe")(process.env.STRIPE_SECRET)

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
        // Find the product to get the image URL
        const product = await Product.findById(req.params.productId);
        if (!product) {
            return resp.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        if (product.imageUrl) {
            const imageUrl = product.imageUrl;
            const publicId = imageUrl.split('/').pop().split('.')[0];

            await cloudinary.uploader.destroy(publicId);            
        }
        let result = await Product.deleteOne({ _id: req.params.productId });
        if (result.deletedCount > 0) {
            resp.status(201).json({
                success: true,
                data: result
            });
        } else {
            resp.status(400).json({
                success: false,
                data: result
            });
        }
    } catch (error) {
        console.error("Error while deleting product:", error);
        resp.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

const updateProduct = async (req, resp) => {
    try {
        let existingProduct = await Product.findById(req.params.productId);
        if (!existingProduct) {
            return resp.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        let fileUrl = '';

        if (req.file) {
            console.log("Update Product img", req.body)
            const existingImageId = existingProduct.imageUrl.split('/').pop().split('.')[0];

            await cloudinary.uploader.destroy(existingImageId);

            const result = await cloudinary.uploader.upload(req.file.path);

            req.body.imageUrl = result.secure_url;
        }

        let product = await Product.updateOne(
            { _id: req.params.productId },
            { $set: req.body }
        );

        resp.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
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
        let product = await Product.findOne({_id:req.params.productId});
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
const getMyProducts = async (req, resp) => {
    try{
        let result = await Product.find({userId:req.params.userId})
        if(result){
            resp.status(200).json({
                success: true,
                data: result
            })
        }
        else{
            resp.status(404).json({
                success: false,
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

const checkoutProduct = async (req, resp) => {
    const products = req.body;
    console.log(products);
    try {
        const lineItems = products.map((product) => ({
            price_data:{
                currency: 'LKR',
                product_data:{
                    name: product.name,
                    // company: product.company,
                    image: product.image
                },
                unit_amount: Math.round(product.price*100),
            },
            quantity: product.quantity
        }))

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: "payment",
            success_url: 'http://localhost:3000/success',
            cancel_url: 'http://localhost:3000/cancel',
        })
        resp.json({id: session.id})
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

module.exports = { 
    addProduct, 
    getAllProducts, 
    getProduct,
    deleteProduct,
    updateProduct,
    searchProduct,
    getMyProducts,
    checkoutProduct,
};
