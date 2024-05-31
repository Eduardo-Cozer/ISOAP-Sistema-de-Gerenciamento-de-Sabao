import mongoose from "mongoose"

const { Schema } = mongoose

const usuarioSchema = new Schema({
    nome: {
        type: String,
        required: true
    },
    senha: {
        type: String,
        required: true
    },
    eAdmin: {
        type: Number,
        required: true
    }
});

const UsuarioModel = mongoose.model("Usuario", usuarioSchema)

export default UsuarioModel