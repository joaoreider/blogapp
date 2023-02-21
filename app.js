
// Carregando módulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')

const app = express()
//const mongoose = require('mongoose')



// Config


// Rotas


// Outros
const PORT = 8081
app.listen(PORT, ()=> {
    console.log(`Servidor rodando na porta ${PORT}`)
})