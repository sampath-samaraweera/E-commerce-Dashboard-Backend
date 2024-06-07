const Jwt = require('jsonwebtoken');
const JWT_KEY=e-com
const generateToken = (payload) => {
    return Jwt.sign(payload, JWT_KEY, { expiresIn: '2h' });
};

module.exports = {
    generateToken,
};
