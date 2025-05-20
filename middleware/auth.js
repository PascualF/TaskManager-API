import pkg from 'jsonwebtoken';
const { verify } = pkg
import dotenv from 'dotenv'
dotenv.config()

const JWT_TOKEN = process.env.TOKEN_SECRET

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({msg: 'No token provided.'})
    }
    // This extracts the token from 'Bearer tzetryezrvebb....' and remove Bearer
    const token = authHeader.split(' ')[1];
    try {
        const payload = verify(token, JWT_TOKEN);
        req.user = {userId: payload.userId};
        next()
    } catch (error) {
        res.status(401).json({msg: 'Not authorized'});
    }
}

export default authMiddleware;