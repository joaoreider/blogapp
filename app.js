
// Carregando módulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')

const app = express()
const admin = require('./routes/admin')
const usuarios = require('./routes/usuarios')
const path = require('path')

const mongoose = require('mongoose')

const session = require('express-session')
const flash = require('connect-flash')
require('./models/Postagem')
require('./models/Categoria')
const Postagem = mongoose.model('postagens')
const Categoria = mongoose.model('categorias')

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

    app.get('/', (req, res)=>{

        Postagem.find().lean().populate("categoria").sort({data: "desc"}).then((postagens) => {
            res.render("index", {postagens:postagens})
        }).catch((err) => {
            req.flash("error_msg", "Erro ao listar postagens (home). Tente novamente")
            res.redirect('/404')
            
        })
        
    })

    app.get('/postagem/:slug', (req, res)=>{
        Postagem.findOne({slug: req.params.slug}).lean().then((postagem) => {
            
            if(postagem){
                res.render("postagem/index", {postagem:postagem})
            }else{

                req.flash("error_msg", "Essa postagem não existe")
                res.redirect('/')
                
            }


        }).catch((err) => {

            req.flash("error_msg", "Erro interno")
            res.redirect('/')
            
        })
    })

    app.get('/categorias', (req, res)=>{

        Categoria.find().lean().then((categorias) => {
            res.render("categorias/index", {categorias: categorias})
        }).catch((err) => {
            req.flash("error_msg", "Erro ao listar categorias")
            res.redirect("/")
        })
    })

    app.get('/categorias/:slug', (req, res)=>{
       Categoria.findOne({slug: req.params.slug}).lean().then((categoria) => {

            if (categoria){

                Postagem.find({categoria: categoria._id}).lean().then((postagens) => {
                    res.render("categorias/postagens", {categoria: categoria, postagens:postagens})

                }).catch((err) => {
                    req.flash("error_msg", "Erro interno")
                    res.redirect("/")
                })

            }else{

                req.flash("error_msg", "Categoria não existe")
                res.redirect("/")

            }

       }).catch((err) => {

        req.flash("error_msg", "Erro interno")
        console.log(err)
        res.redirect("/")
        
        })
        
    })

    app.get('/404', (req, res)=>{
        res.send('Erro 404!')
    })


    app.use('/admin', admin)
    app.use('/usuarios', usuarios)

// Outros
const PORT = 8081
app.listen(PORT, ()=> {
    console.log(`Servidor rodando na porta ${PORT}`)
})