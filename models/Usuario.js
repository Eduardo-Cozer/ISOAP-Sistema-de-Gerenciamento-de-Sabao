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

const UsuarioModel = mongoose.model("Usuario", usuarioSchema);

export default UsuarioModel;