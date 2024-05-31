import mongoose from "mongoose"

const { Schema } = mongoose

const clienteSchema = new Schema({
    nome: {
        type: String,
        required: true
    },
    telefone: {
        type: Number,
        required: true
    },
    rua: {
        type: String,
        required: true
    },
    numero: {
        type: Number,
        required: true
    },
    bairro: {
        type: String,
        required: true
    },
    cidade: {
        type: String,
        required: true
    },
    complemento: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

const ClienteModel = mongoose.model("Cliente", clienteSchema)

export default ClienteModel
