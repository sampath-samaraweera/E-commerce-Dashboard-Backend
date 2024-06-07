const User = require('../models/User');
const Jwt = require('jsonwebtoken');

const JWT_KEY=e-com


const register = async (req, resp) => {
    try {
        let user = new User(req.body);
        let result = await user.save();
        result = result.toObject();
        delete result.password;
        Jwt.sign({result}, JWT_KEY, {expiresIn:"2h"}, (error, token) => {
            if (error) {
                return resp.status(400).json({
                    success: false,
                    message: "Something went wrong",
                    error: error.message
                });
            }
            resp.status(201).json({
                success: true,
                data: result,
                auth: token
            });
        });
    } catch (error) {
        console.error("Error saving user:", error);
        resp.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

const login = async (req, resp) => {
    try {
        if (req.body.email && req.body.password) {
            let user = await User.findOne(req.body).select("-password");
            if (user) {
                Jwt.sign({user}, process.env.JWT_KEY, {expiresIn:"2h"}, (error, token) => {
                    if (error) {
                        return resp.status(400).json({
                            success: false,
                            message: "Something went wrong",
                            error: error.message
                        });
                    }
                    resp.status(200).json({
                        success: true,
                        data: user,
                        auth: token
                    });
                });
            } else {
                resp.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }
        } else {
            resp.status(400).json({
                success: false,
                message: "Not enough user details!"
            });
        }
    } catch (error) {
        console.error("Error logging in user:", error);
        resp.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

module.exports = { register, login };
