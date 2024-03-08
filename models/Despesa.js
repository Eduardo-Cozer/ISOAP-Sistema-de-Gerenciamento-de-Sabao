import mongoose from "mongoose";

const { Schema } = mongoose;

const desepesaSchema = new Schema({
    nome: {
        type: String,
        required: true
    },
    preco: {
        type: Number,
        required: true
    },
    descricao: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

const DespesaModel = mongoose.model("Despesa", desepesaSchema);

export default DespesaModel;