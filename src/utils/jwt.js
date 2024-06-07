const Jwt = require('jsonwebtoken');

const generateToken = (payload) => {
    return Jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '2h' });
};

module.exports = {
    generateToken,
};
