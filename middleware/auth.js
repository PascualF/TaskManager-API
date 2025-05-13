const jwt = require('jsonwebtoken');
require('dotenv').config()

const JWT_TOKEN = process.env.TOKEN_SECRET

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({msg: 'No token provided.'})
    }

    const token = authHeader.split(' ')[1]; // This extracts the token from 'Bearer tzetryezrvebb....'

    try {
        const payload = jwt.verify(token, JWT_TOKEN);
        req.user = {useId: payload.userId};
        next()
    } catch (error) {
        res.status(401).json({msg: 'Not authorized'});
    }
}

module.exports = authMiddleware;