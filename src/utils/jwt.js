const Jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_KEY= process.env.JWT_KEY

const generateToken = (payload) => {
    return Jwt.sign(payload, JWT_KEY, { expiresIn: '2h' });
};

module.exports = {
    generateToken,
};
