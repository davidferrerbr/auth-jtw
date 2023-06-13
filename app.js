/* imports */
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// const checkToken = require("./middleware/middleware")

//IMPORT `ROUTERS`
const usersRouter = require("./users/users.router");

const app = express()

// Config JSON Response
app.use(express.json())

// Models
// const User = require('./models/User')
app.use("/users", usersRouter);

// Open Route - Public Route
app.get('/', (req, res) => {
    res.status(200).json({msg: 'Bem vindo a nossa API'})
})

// Private Route
/* app.get('/user/:id', checkToken, async (req, res) => {

    const id = req.params.id

    // check if user exists

    const user = await User.findById(id, '-password')

    if (!user) {
        return res.status(404).json({msg: "Usuário não encontrado!"})
    }

    res.status(200).json({user})
}) */

// Register User
app.post('/auth/register', async(req, res) => {

    const {name, email, password, confirmpassword} = req.body

    // validations
    if (!name) {
        return res.status(422).json({msg: 'O nome é obrigatório!'})
    }

    if (!email) {
        return res.status(422).json({msg: 'O email é obrigatório!'})
    }

    if (!password) {
        return res.status(422).json({msg: 'A senha é obrigatório!'})
    }

    if (password !== confirmpassword) {
        return res.status(422).json({msg: 'As senhas não conferem!'})
    }

    // chec if user exists
    const userExists = await User.findOne({ email: email })

    if (userExists) {
        return res.status(422).json({msg: 'Por favor, utilize outro e-mail!'})
    }

    // create password
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    // create user
    const user = new User ({
        name,
        email,
        password: passwordHash,
    })

    try {

        await user.save()

        res.status(201).json({msg: "Usuário criado com Sucesso!"})

    } catch(error) {
        console.log(error)

        res
            .status(500)
            .json({
                msg: "Erro no servidor, tente novamente mais tarde!",
            })

    }
})

// login User
app.post("/auth/login", async (req, res) => {

    const {email, password} = req.body

    // validations
    if (!email) {
        return res.status(422).json({msg: 'O email é obrigatório!'})
    }

    if (!password) {
        return res.status(422).json({msg: 'A senha é obrigatória!'})
    }

    // check if user exists
    const user = await User.findOne({email: email})

    if (!user) {
        return res.status(404).json({msg: "Usuário nâo encontrado!"})
    }

    // check if password match
    const checkPassword = await bcrypt.compare(password, user.password)

    if (!checkPassword) {
        return res.status(422).json({msg: "Senha Inválida!"})
    }

    try {
        
        const secret = process.env.SECRET

        const token = jwt.sign({
            id: user._id,
        },
        secret,
        )

        res.status(200).json({msg: "Autenticação realizada com sucesso", token})
        
    } catch (err) {
        console.log(error)

            res
                .status(500)
                .json({
                    msg: "Erro no servidor, tente novamente mais tarde!",
                })

    }

} )

// Credencials
const dbUser = process.env.DB_USER
const dbPass = process.env.DB_PASS

mongoose.connect(
    `mongodb+srv://${dbUser}:${dbPass}@cluster0.wu3dfmg.mongodb.net/?retryWrites=true&w=majority`,
    ).then(() => {
    app.listen(3000)
    console.log("Conectou com Sucesso!")
}).catch((err) => console.log(err))

