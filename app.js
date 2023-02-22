
// Carregando módulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')

const app = express()
const admin = require('./routes/admin')
const path = require('path')

const mongoose = require('mongoose')

const session = require('express-session')
const flash = require('connect-flash')

// Config

    // Session
    app.use(session({
        secret: "cursodenode",
        resave: true,
        saveUninitialized: true
    }))
    app.use(flash())
    // Middleware
    app.use((req, res, next) => {
        res.locals.success_msg = req.flash("success_msg")
        res.locals.error_msg = req.flash("error_msg")
        next()
    })

    // Body Parser
    app.use(express.json());
    app.use(express.urlencoded({
    extended: true
    }));

    // Handlebars
    app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars')

    // Mongoose
    mongoose.connect("mongodb+srv://joaopauloj405:1412@node-express.c70sayb.mongodb.net/?retryWrites=true&w=majority").then(()=> {
        console.log("Conexão com o banco feita com sucesso.")
    }).catch((err)=>{
        console.log("Erro ao se conectar no mongodb: " + err)
    });

    // Public
    app.use(express.static(path.join(__dirname, "public")))

// Rotas

    app.use('/admin', admin)

// Outros
const PORT = 8081
app.listen(PORT, ()=> {
    console.log(`Servidor rodando na porta ${PORT}`)
})