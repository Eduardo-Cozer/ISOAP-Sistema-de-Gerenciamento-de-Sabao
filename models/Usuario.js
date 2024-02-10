/*import mongoose from "mongoose"
const Schema = mongoose.Schema

const Usuario = new Schema({
    nome: {
        type: String,
        required: true
    },
    eAdmin: {
        type: Number,
        required: true,
        default: 0
    },
    senha: {
        type: String,
        required: true
    }
})

mongoose.model("usuarios", Usuario)*/

import mongoose from "mongoose";

const { Schema } = mongoose;

const usuarioSchema = new Schema({
    nome: {
        type: String,
        required: true
    },
    eAdmin: {
        type: Number,
        required: true,
        default: 0
    },
    senha: {
        type: String,
        required: true
    }
});

const UsuarioModel = mongoose.model("usuarios", usuarioSchema);

export default UsuarioModel;