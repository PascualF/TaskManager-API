const jwt = require('jsonwebtoken')

const JWT_TOKEN = '09349318cd950786683086dfc44cbade2d14caf9ad8bc46302d4910e462b52800e566558f368e531161467015509325f7b6ebf77b69da53e65af4b994ec1219c'
const userId = '68245227eeba4a11dfea024b'
const JWT_EXPIRES = '1d'

const token = jwt.sign({userId : userId}, JWT_TOKEN, {expiresIn: JWT_EXPIRES})

console.log(token)