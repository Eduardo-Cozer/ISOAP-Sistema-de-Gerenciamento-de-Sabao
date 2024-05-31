import mongoose from "mongoose"

const { Schema } = mongoose

const pedidoSchema = new Schema({
    numeroPedido: {
        type: String,
        unique: true
    },
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
    frete: {
        type: Number,
        required: true
    },
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

pedidoSchema.pre('save', async function(next) {
    try {
        if(!this.numeroPedido){
            const ultimoPedido = await this.constructor.findOne({}, {}, { sort: { 'data': -1 } })
            let proximoNumeroPedido = 1
            if(ultimoPedido){
                proximoNumeroPedido = parseInt(ultimoPedido.numeroPedido.split('-')[1]) + 1
            }

            this.numeroPedido = `PED-${proximoNumeroPedido.toString().padStart(6, '0')}`
        }
        next();
    } catch (error) {
        next(error)
    }
});

const PedidoModel = mongoose.model("Pedido", pedidoSchema)

export default PedidoModel
