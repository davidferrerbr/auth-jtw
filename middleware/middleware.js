require('dotenv').config()
const jwt = require('jsonwebtoken')

const checkToken = (req, res, next) => {

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    console.log(authHeader)
    console.log(token)

    if (!token) {
        return res.status(401).json({msg: "Acesso negado!"})
    }

    try {

        const secret = process.env.SECRET

        jwt.verify(token, secret)

        next()
        
    } catch (error) {
        res.status(400).json({msg: "Token Inválido!"})
        
    }

}

module.exports = checkToken;