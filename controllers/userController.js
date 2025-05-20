import User from '../models/User.js';
import pkg from 'jsonwebtoken';
const {sign} = pkg
import dotenv from 'dotenv'
dotenv.config()

// Token created
const JWT_TOKEN = process.env.TOKEN_SECRET;
const JWT_EXPIRES = '1d'

// Register
export const registerUser = async (req, res) => {
    const { name, email, password} = req.body;

    try {
        // Model.create mongoose 
        const user = await User.create({ name, email, password})
        //This creates a JWT token (payload, secretkey, valid token time)
        const token = sign({userId: user._id}, JWT_TOKEN, {expiresIn: JWT_EXPIRES}); 
        res.status(201).json({user: {name:user.name, userId:user._id}, token}) // Json containing user's name and token
    } catch (error) {
        console.log('error' + error)
    }
}

// Login 
export const loginUser =  async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if(!user) return res.status(401).json({msg: 'Invalid email'});

        const isMatch = await user.comparePassword(password);
        if(!isMatch) return res.status(401).json({msg: 'Invalid password'});

        const token = sign({userId : user._id}, JWT_TOKEN, {expiresIn: JWT_EXPIRES})
        res.status(201).json({user: {name:user.name, userId:user._id}, token}) // Json containing user's name and token
    } catch( error) {
        console.log('error - ' + error)
    }
}

/* export default {
    registerUser,
    loginUser
} */