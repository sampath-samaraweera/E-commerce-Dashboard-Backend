const express = require('express');
const cors = require('cors');
require("./db/config");
const User = require("./db/User");
const Product = require("./db/Product");
const app = express();
const Jwt = require('jsonwebtoken');
const jwtKey = 'e-com';


app.use(express.json());
app.use(cors());

// Routes
app.post("/register", async (req, resp) => {
    try {
        let user = new User(req.body);
        let result = await user.save();
        result = result.toObject();
        delete result.password
        Jwt.sign({result}, jwtKey, {expiresIn:"2h"},(error,token)=>{
            if(error){
                resp.status(400).json({
                    success: false,
                    message: "Something went wrong",
                    error: error.message
                });
            }   
            resp.status(201).json({
            success: true,
            data: result,
            auth:token
        });
        })
    } 
    catch (error) {
        console.error("Error saving user:", error);
        resp.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
});

app.post("/login", async (req, resp) => {
    try{
        if (req.body.email && req.body.password){
            let user = await User.findOne(req.body).select("-password");
            if (user) {
                Jwt.sign({user}, jwtKey, {expiresIn:"2h"},(error,token)=>{
                    if(error){
                        resp.status(400).json({
                            success: false,
                            message: "Something went wrong",
                            error: error.message
                        });
                    }  
                    resp.status(200).json({
                        success: true,
                        data: user,
                        auth:token
                    });
                })
            } 
            else {
                resp.status(404).json({
                    success: false,
                    data: user
                });
            }
        } 
        else {
            resp.status(400).json({
                success: false,
                message: "Not enough user details!"
            });
        }

    }
    catch(error){
        console.error("Error login user:", error);
        resp.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
});

app.post("/add-product", verifyToken,async (req, resp) => {
    try{
        let product = new Product(req.body)
        let result = await product.save();
        resp.status(201).json({
            success: true,
            data: result
        });
    }
    catch(error){
        console.error("Error while adding product:", error);
        resp.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }

});

app.get("/products", verifyToken,async (req, resp) => {
    try{
        let products = await Product.find();
        if (products.length > 0 ) {
            resp.status(200).json({
                success: true,
                data: products
            })
        }else {
            resp.status(200).json({
                success: true,
                data: products
            })
        }
    }
    catch(error){
        console.error("Error while adding product:", error);
        resp.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }

})

app.delete("/product/:id", verifyToken,async (req, resp) => {
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

})

app.put("/product/:id", verifyToken,async (req, resp) => {
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

})

app.get('/product/:id', verifyToken,async (req, resp) => {
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

})

app.get("/search/:key", verifyToken,async (req, resp) => {
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

})



// Middleware
function verifyToken(req, resp, next){ 
    try{
        console.log(req.headers['authorization']);
        let token = req.headers['authorization'];
        if(token){
            token = token.split(' ')[1];
            console.log(token)
            Jwt.verify(token, jwtKey,(error, valid)=>{
                if(error){
                    resp.status(401).json({
                        success: false,
                        message: "Please provide valid token",
                        error: error.message
                    });
                }else{
                    next();
                }
            })
        }else{
            resp.status(403).json({
                success: false,
                message: "Please provide a token",
                error: error.message
            });
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

}
 

// Start the server
app.listen(5000, () => {
    console.log("Server is running on port 5000");

});
