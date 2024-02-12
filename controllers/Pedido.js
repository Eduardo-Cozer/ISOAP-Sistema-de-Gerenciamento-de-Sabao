import PedidoModel from "../models/Pedido.js"
import ClienteModel from "../models/Cliente.js"
import ProdutoModel from "../models/Produto.js"

class Pedido extends PedidoModel {
    constructor() {
      super()
    }
  
    async home(req, res) {
        try {
            const pedidos = await Pedido.find()
                .populate({
                    path: 'cliente',
                    select: 'nome'
                })
                .populate({
                    path: 'itens.produto',
                    select: 'nome preco'
                })
                .sort({ data: 'desc' })
            res.render('index', { pedidos })
        } catch (err) {
            req.flash('error_msg', 'Houve um erro ao exibir os pedidos recentes')
            res.status(500).redirect('/')
        }
    }
  
    async list(req, res) {
        try {
            const pedidos = await Pedido.find()
                .populate({
                    path: 'cliente',
                    select: 'nome'
                })
                .populate({
                    path: 'itens.produto',
                    select: 'nome preco'
                })
                .sort({ data: 'desc' })
            res.render('pedidos/pedidos', { pedidos })
        } catch (err) {
            req.flash('error_msg', 'Houve um erro ao listar pedidos')
            res.status(500).redirect('/')
        }
    }

    async addPage(req, res) {
        try {
            const [clientes, produtos] = await Promise.all([
                ClienteModel.find(),
                ProdutoModel.find()
            ])
            res.render("pedidos/addpedidos", { clientes, produtos })
        } catch (err) {
            req.flash("error_msg", "Houve um erro ao carregar o formulário")
            res.status(500).redirect("/pedidos")
        }   
    }

    async add(req, res){
        const {cliente, pagamento, descricao, total} = req.body
        const produtos = req.body.produto
        const quantidades = req.body.quantidade
            
        try{
            if(!cliente || cliente === "0" || !pagamento || pagamento === "0" || !total || total === "0" || !produtos || !quantidades){
                req.flash("error_msg", "Por favor, preencha todos os campos obrigatórios.")
                return res.status(400).redirect("/pedidos/add")
            }

            if(!Array.isArray(produtos) || !Array.isArray(quantidades) || produtos.length !== quantidades.length){
                req.flash("error_msg", "Erro ao processar os produtos.")
                return res.status(400).redirect("/pedidos/add")
            }

            let formaPagamento
            if(req.body.pagamento === "1"){
                formaPagamento = "Pix"
            }else if(req.body.pagamento === "2"){
                formaPagamento = "Dinheiro"
            }else if(req.body.pagamento === "3"){
                formaPagamento = "Cartão"
            }else{
                formaPagamento = "Escolha..."
            }
    
            const itensPedido = []
    
            for(let i = 0 ; i < produtos.length ; i++){
                const itemPedido = {
                    produto: produtos[i],
                    quantidade: quantidades[i]
                }
                itensPedido.push(itemPedido)
            }

            const novoPedido = new PedidoModel({
                cliente,
                itens: itensPedido,
                pagamento: formaPagamento,
                descricao,
                total
            })

            await novoPedido.save()
    
            req.flash("success_msg", "Pedido criado com sucesso!")
            res.redirect("/pedidos")
        }catch (err){
            req.flash("error_msg", "Erro ao criar pedido, tente novamente.")
            res.status(500).redirect("/pedidos/add")
        }
    }


    async editPage(req, res) {
        try {
            const pedido = await Pedido.findOne({ _id: req.params.id })
                .populate('cliente')
                .populate('itens.produto')
            const [clientes, produtos] = await Promise.all([
                ClienteModel.find(),
                ProdutoModel.find()
            ])
            res.render("pedidos/editpedidos", { clientes, produtos, pedido })
        } catch (err) {
            req.flash("error_msg", "Houve um erro ao carregar o formulário de edição")
            res.status(500).redirect("/pedidos")
        }
    }

    async edit(req, res) {
        try {
            const pedido = await Pedido.findOne({ _id: req.body.id })
                .populate('cliente')
                .populate('itens.produto')
            const clientes = await Cliente.find()
            const produtos = await Produto.find()
    
            const erros = []
    
            if (!req.body.cliente || req.body.cliente === "0" || !req.body.pagamento || req.body.pagamento === "0" || !req.body.total || req.body.total === "0" || !req.body.produto || !req.body.quantidade) {
                erros.push({ texto: "Por favor, preencha todos os campos obrigatórios." })
            }
    
            let formaPagamento
            if (req.body.pagamento === "1" || req.body.pagamento === "Pix") {
                formaPagamento = "Pix"
            } else if (req.body.pagamento === "2" || req.body.pagamento === "Dinheiro") {
                formaPagamento = "Dinheiro"
            } else if (req.body.pagamento === "3" || req.body.pagamento === "Cartão") {
                formaPagamento = "Cartão"
            } else {
                formaPagamento = "Escolha..."
            }
    
            if (erros.length > 0) {
                res.status(400).render("pedidos/editpedidos", { erros, clientes, produtos, pedido })
            } else {
                pedido.cliente = req.body.cliente
                pedido.itens = req.body.produto.map((produtoId, index) => ({
                    produto: produtoId,
                    quantidade: req.body.quantidade[index]
                }))
                pedido.pagamento = formaPagamento
                pedido.descricao = req.body.descricao
                pedido.total = req.body.total
    
                await pedido.save()
                req.flash("success_msg", "Pedido editado com sucesso!")
                res.redirect("/pedidos")
            }
        } catch (err) {
            req.flash("error_msg", "Houve um erro ao editar o pedido")
            res.status(500).redirect("/pedidos")
        }
    }

    async delete(req, res) {
        try {
            await Pedido.deleteOne({ _id: req.params.id })
            req.flash("success_msg", "Pedido deletado com sucesso")
            res.redirect("/pedidos")
        } catch (err) {
            res.flash("error_msg", "Houve um erro ao deletar o pedido")
            res.status(500).redirect("/pedidos")
        }
    }
}

export default Pedido