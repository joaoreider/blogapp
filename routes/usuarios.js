
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

require('../models/Usuario')
const Usuario =  mongoose.model('usuarios')

router.get("/registro", (req, res) => {
    res.render("usuarios/registro")

})

router.post("/registro", (req, res) => {

    var erros = []
    
    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido"})
    }

    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erros.push({texto: "Email inválido"})
    }

    if (!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
        erros.push({texto: "Senha inválido"})
    }

    if (req.body.senha.length < 4){
        erros.push({texto: "Senha muito curta"})
    }

    if (req.body.senha !== req.body.senha2){
        erros.push({texto: "As senhas precisam ser iguais"})
    }

    if(erros.length > 0){

        res.render("usuarios/registro", {erros:erros})

    }else{
        
        Usuario.findOne({email:req.body.email}).then((usuario)=> {

            if (usuario){
                req.flash("error_msg", "Email já cadastrado")
                res.redirect("/usuarios/registro")

            }else{

                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha
                })

                bcrypt.genSalt(10, (err, salt)=>{
                    bcrypt.hash(novoUsuario.senha, salt, (err, hash)=>{
                        if (err){
                            req.flash("error_msg", "Erro ao salvar usuário")
                            res.redirect("/")
                        }
                        novoUsuario.senha = hash
                        novoUsuario.save().then(()=> {
                            req.flash("success_msg", "Usuário cadastrado com sucesso")
                            res.redirect("/usuarios/login")
                        }).catch((err)=>{
                            req.flash("error_msg", "Erro ao criar usuário")
                            res.redirect("/usuarios/registro")

                        })
                    })
                })


            }

        }).catch((err)=>{
            req.flash("error_msg", "Erro interno")
            res.redirect("/")
        })


    }

})

router.get("/login", (req, res) => {
    res.render("usuarios/login")

})



module.exports = router