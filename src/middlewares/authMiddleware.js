const Jwt = require('jsonwebtoken');
const JWT_KEY="e-com"

const verifyToken = (req, resp, next) => {
    try {
        let token = req.headers['authorization'];
        if (token) {
            token = token.split(' ')[1];
            Jwt.verify(token, JWT_KEY, (error, valid) => {
                if (error) {
                    return resp.status(401).json({
                        success: false,
                        message: "Please provide valid token",
                        error: error.message
                    });
                } else {
                    next();
                }
            });
        } else {
            resp.status(403).json({
                success: false,
                message: "Please provide a token"
            });
        }
    } catch (error) {
        console.error("Error while verifying token:", error);
        resp.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

module.exports = verifyToken;
