const express = require('express')
const router = express.Router();

const {
    getUser
} = require('../controllers/userController.js')

router.get('/user', getUser)

module.exports = router