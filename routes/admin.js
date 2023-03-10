
const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')
require('../models/Postagem')
const Categoria =  mongoose.model('categorias')
const Postagem =  mongoose.model('postagens')


router.get('/', (req, res) => {
    res.render("admin/index")
})

router.get('/posts', (req, res) => {
    res.send("Página  de Posts")
})

router.get('/categorias', (req, res) => {
    Categoria.find().lean().then((categorias) => {
        res.render("admin/categorias", {categorias: categorias})
    }).catch((err) => {
        req.flash("error_msg", "Erro ao listar categorias")
        res.redirect("/admin")
    })
    
})

router.get('/categorias/add', (req, res) => {
    res.render("admin/addcategorias")
})

router.post('/categorias/nova', (req, res) => {

    var erros = []

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido"})
    }

    if (!req.body.slug|| typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Slug inválido"})
    }

    if (erros.length > 0){
        res.render("admin/addcategorias", {erros: erros})
    }else{

       const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
       }
       new Categoria(novaCategoria).save().then(() => {
            req.flash("success_msg", "Categoria cadastrada com sucesso!")
            res.redirect("/admin/categorias")
       }).catch((err) => {
            req.flash("error_msg", "Erro ao cadastrar categoria. Tente novamente")
            res.redirect("/admin")
       })

    }
})

router.get('/categorias/edit/:id', (req, res) => {


    Categoria.findOne({_id: req.params.id}).lean().then((categoria) => {
        res.render("admin/editcategorias", {categoria: categoria})
    }).catch((err) => {
        req.flash("error_msg", "Essa categoria não existe")
        res.redirect("/admin/categorias")
    })
    
})

router.post('/categorias/edit', (req, res) => {

    Categoria.updateOne({_id: req.body.id},{$set:{nome:req.body.nome, slug:req.body.slug}}).then(() => {

            req.flash("success_msg", "Categoria editada com sucesso!")
            res.redirect("/admin/categorias")
        
    
    }).catch((err) => {
        req.flash("error_msg", "Erro ao editar categoria. Tente novamente")
        console.log(err)
        res.redirect("/admin/categorias")
    })
    
})

router.post('/categorias/deletar', (req, res) => {
    Categoria.remove({_id: req.body.id}).then(() => {

        req.flash("success_msg", "Categoria removida com sucesso!")
        res.redirect("/admin/categorias")
    

    }).catch((err) => {
        req.flash("error_msg", "Erro ao deletar categoria. Tente novamente")
        console.log(err)
        res.redirect("/admin/categorias")
    })
})

router.get('/postagens', (req, res) => {

    Postagem.find().lean().populate("categoria").sort({data: "desc"}).then((postagens) => {
        res.render("admin/postagens", {postagens:postagens})
    }).catch((err) => {
        req.flash("error_msg", "Erro ao listar postagens. Tente novamente")
        res.redirect("/admin")
    })

    
})

router.get('/postagens/add', (req, res) => {
    Categoria.find().lean().then((categorias) => {
        res.render("admin/addpostagens", {categorias: categorias})
    }).catch((err) => {
        req.flash("error_msg", "Erro ao carregar formulario. Tente novamente")
        res.redirect("/admin")
    })
    
})

router.post('/postagens/nova', (req, res) => {

    var erros = []

    if (req.body.categoria == "0"){

        erros.push({texto: "Registre uma categoria"})

    }

    if (erros.length > 0){
        res.render("admin/addpostagens", {erros: erros})
    }else{

        const novaPostagem = {
             titulo: req.body.titulo,
             descricao: req.body.descricao,
             conteudo: req.body.conteudo,
             slug: req.body.titulo,
             categoria: req.body.categoria

        }
        new Postagem(novaPostagem).save().then(() => {
             req.flash("success_msg", "Postagem cadastrada com sucesso!")
             res.redirect("/admin/postagens")
        }).catch((err) => {
             req.flash("error_msg", "Erro ao cadastrar postagem. Tente novamente")
             res.redirect("/admin/postagens")
        })
 
     }
   
})


router.get('/postagens/edit/:id', (req, res) => {


    Postagem.findOne({_id: req.params.id}).lean().then((postagem) => {

        Categoria.find().lean().then((categorias) => {

            res.render("admin/editpostagens", {categorias: categorias, postagem: postagem})

        }).catch((err) => {
            req.flash("error_msg", "Erro ao listar categorias. Tente novamente")
            res.redirect("/admin/postagens")
        })
        
        //res.render("admin/editpostagens", {postagem: postagem})
    }).catch((err) => {
        req.flash("error_msg", "Erro ao carregar formulário de edição")
        res.redirect("/admin/postagens")
    })
    
})

router.post('/postagens/edit', (req, res) => {

    Postagem.updateOne({_id: req.body.id},{$set:{

        titulo: req.body.titulo,
        slug: req.body.slug,
        descricao: req.body.descricao,
        conteudo: req.body.conteudo,
        categoria: req.body.categoria
    
    }}).then(() => {
    
            req.flash("success_msg", "Postagem editada com sucesso!")
            res.redirect("/admin/postagens")
        
    
    }).catch((err) => {
        req.flash("error_msg", "Erro ao editar postagem. Tente novamente")
        res.redirect("/admin/postagens")
    })
     
})

router.get('/postagens/deletar/:id', (req, res) => {
    Postagem.deleteOne({_id: req.params.id}).then(() => {
        req.flash("success_msg", "Postagem deletada com sucesso!")
        res.redirect("/admin/postagens")
    }

      
    ).catch((err) => {
        req.flash("error_msg", "Erro ao deletar postagem. Tente novamente")
        res.redirect("/admin/postagens")
    })
})

module.exports = router