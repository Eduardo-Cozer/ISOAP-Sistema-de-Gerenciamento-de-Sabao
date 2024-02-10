/*import mongoose from "mongoose"
const Schema = mongoose.Schema;

const Pedido = new Schema({
    cliente: {
        type: Schema.Types.ObjectId,
        ref: "clientes",
        required: true
    },
    itens: [{
        produto: {
        type: Schema.Types.ObjectId,
        ref: "produtos",
        required: true
        },
        quantidade: {
            type: Number,
            required: true
        },
    }],
    pagamento: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
    },
    total: {
        type: Number,
        required: true
    },
    data: {
        type: Date,
        default : Date.now()
    }
})

mongoose.model("pedidos", Pedido)*/

import mongoose from "mongoose";

const { Schema } = mongoose;

const pedidoSchema = new Schema({
    cliente: {
        type: Schema.Types.ObjectId,
        ref: "Cliente",
        required: true
    },
    itens: [{
        produto: {
            type: Schema.Types.ObjectId,
            ref: "Produto",
            required: true
        },
        quantidade: {
            type: Number,
            required: true
        },
    }],
    pagamento: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
    },
    total: {
        type: Number,
        required: true
    },
    data: {
        type: Date,
        default: Date.now()
    }
});

const PedidoModel = mongoose.model("pedidos", pedidoSchema);

export default PedidoModel;
