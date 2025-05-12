const User = require('../models/User')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const register = async (req, res) => {
    const user = await User.create(req.body); // Name, email and password (hashed)
    const token = jwt.sign(name, process.env.TOKEN_SECRET)
}