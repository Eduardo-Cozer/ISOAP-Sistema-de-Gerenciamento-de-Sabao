import mongoose from "mongoose"

const { Schema } = mongoose

const produtoSchema = new Schema({
    nome: {
        type: String,
        required: true
    },
    preco: {
        type: Number,
        required: true
    },
    quantidade: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

const ProdutoModel = mongoose.model("Produto", produtoSchema)

export default ProdutoModel