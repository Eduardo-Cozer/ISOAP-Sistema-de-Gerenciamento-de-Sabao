/*import mongoose from "mongoose"
const Schema = mongoose.Schema

const Produto = new Schema({
    nome: {
        type: String,
        required: true
    },
    preco: {
        type: Number,
        required: true
    },
})

mongoose.model("produtos", Produto)*/

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

const ProdutoModel = mongoose.model("produtos", produtoSchema);

export default ProdutoModel;