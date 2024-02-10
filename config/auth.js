import { Strategy as LocalStrategy } from 'passport-local';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import '../models/Usuario.js';
const Usuario = mongoose.model("usuarios")

export default function(passport){
    passport.use(new LocalStrategy({usernameField: 'nome', passwordField: 'senha'}, async(nome, senha, done) => {
        try{
            const usuario = await Usuario.findOne({nome});

            if(!usuario){
                return done(null, false, {message: 'Esta conta não existe'});
            }

            const batem = await bcrypt.compare(senha, usuario.senha);

            if(batem){
                return done(null, usuario);
            }else{
                return done(null, false, {message: 'Senha incorreta'});
            }
        }catch(err){
            return done(err);
        }
    }));

    passport.serializeUser((usuario, done) => {
        done(null, usuario.id);
    });

    passport.deserializeUser(async (id, done) => {
        try{
            const usuario = await Usuario.findById(id);
            done(null, usuario);
        }catch (err){
            done(err);
        }
    });
}
