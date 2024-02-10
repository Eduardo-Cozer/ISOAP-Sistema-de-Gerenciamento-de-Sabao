import mongoose from "mongoose";

const { Schema } = mongoose;

const produtoSchema = new Schema({
    nome: {
        type: String,
        required: true
    },
    preco: {
        type: Number,
        required: true
    }
});

const ProdutoModel = mongoose.model("Produto", produtoSchema);

export default ProdutoModel;