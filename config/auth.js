import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import UsuarioModel from "../models/Usuario.js"

export default class Auth {
    constructor(passport) {
        this.passport = passport;
        this.initialize();
    }

    initialize() {
        this.passport.use(new LocalStrategy({ usernameField: 'nome', passwordField: 'senha' }, this.authenticateUser.bind(this)));
        this.passport.serializeUser(this.serializeUser.bind(this));
        this.passport.deserializeUser(this.deserializeUser.bind(this));
    }

    async authenticateUser(nome, senha, done) {
        try {
            const usuario = await UsuarioModel.findOne({ nome });

            if (!usuario) {
                return done(null, false, { message: 'Esta conta não existe' });
            }

            const batem = await bcrypt.compare(senha, usuario.senha);

            if (batem) {
                return done(null, usuario);
            } else {
                return done(null, false, { message: 'Senha incorreta' });
            }
        } catch (err) {
            return done(err);
        }
    }

    serializeUser(usuario, done) {
        done(null, usuario.id);
    }

    async deserializeUser(id, done) {
        try {
            const usuario = await UsuarioModel.findById(id);
            done(null, usuario);
        } catch (err) {
            done(err);
        }
    }
}