const jwt = require('jsonwebtoken');

const generateAccessToken = (user) => {
    return jwt.sign(user, process.env.JWT_ACCESS_KEY, { expiresIn: '15m' });
};

const generateRefreshToken = (user) => {
    return jwt.sign(user, process.env.JWT_REFRESH_KEY, { expiresIn: '7d' });
};

module.exports = {
    generateAccessToken,
    generateRefreshToken
};