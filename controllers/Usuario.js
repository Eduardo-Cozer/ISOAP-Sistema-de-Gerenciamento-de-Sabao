import passport from 'passport';
import bcrypt from 'bcrypt';
import UsuarioModel from "../models/Usuario.js";

class Usuario extends UsuarioModel {
    constructor() {
        super();
    }

    loginPage(req, res) {
        res.render("usuarios/login");
    }

    login(req, res, next) {
        passport.authenticate("local", {
            successRedirect: "/home",
            failureRedirect: "/",
            failureFlash: true
        })(req, res, next);
    }

    registerPage(req, res) {
        res.render("usuarios/registro");
    }

    async register(req, res) {
        try {
            const { nome, senha, senha2 } = req.body;
            const erros = [];

            if (!nome || !senha || !senha2 || senha.length < 4 || senha !== senha2) {
                erros.push({ texto: "Dados inválidos" });
                return res.render("usuarios/registro", { erros });
            }

            const usuarioExistente = await UsuarioModel.findOne({ nome });
            if (usuarioExistente) {
                req.flash("error_msg", "Já existe uma conta cadastrada com esse nome");
                return res.redirect("/registro");
            }

            const novoUsuario = new Usuario({ nome, senha });
            const salt = await bcrypt.genSalt(10);
            novoUsuario.senha = await bcrypt.hash(novoUsuario.senha, salt);
            await novoUsuario.save();

            req.flash("success_msg", "Usuário criado com sucesso!");
            res.redirect("/");
        } catch (err) {
            req.flash("error_msg", "Houve um erro ao criar o usuário");
            res.redirect("/registro");
        }
    }

    logoutPage(req, res) {
        req.logout((err) => {
            req.flash("success_msg", "Deslogado com sucesso!");
            res.redirect("/");
        });
    }

    deletePage(req, res) {
        res.render("usuarios/deletar");
    }

    delete(req, res, next) {
        passport.authenticate("local", (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                req.flash("error_msg", "Nome ou senha incorretos");
                return res.redirect("/deletar");
            }
            UsuarioModel.deleteOne({ _id: user._id })
                .then(() => {
                    req.flash("success_msg", "Conta deletada com sucesso!");
                    res.redirect("/");
                })
                .catch((err) => {
                    req.flash("error_msg", "Houve um erro ao deletar a conta");
                    res.redirect("/deletar");
                });
        })(req, res, next);
    }
  
    logoutPage(req, res) {
        req.logOut((err) => {
            req.flash("success_msg", "Deslogado com sucesso!")
            res.redirect("/")
        }) 
    }
  
    deletePage(req, res) {
        res.render("usuarios/deletar")
    }
  
    async delete(req, res, next) {
        try {
            passport.authenticate("local", async (err, user, info) => {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    req.flash("error_msg", "Nome ou senha incorretos");
                    return res.redirect("/deletar");
                }
                await Usuario.deleteOne({ _id: user._id });
                req.flash("success_msg", "Conta deletada com sucesso!");
                res.redirect("/");
            })(req, res, next);
        } catch (err) {
            req.flash("error_msg", "Houve um erro ao deletar a conta");
            res.redirect("/deletar");
        }
    }
}