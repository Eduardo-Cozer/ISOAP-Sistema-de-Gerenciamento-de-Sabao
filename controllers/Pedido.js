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
            res.status(500).redirect('/home')
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
            res.status(500).redirect('/home')
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
        const { cliente, pagamento, descricao, total, produto, quantidade } = req.body;
        
        try {
            if (!cliente || cliente === "0" || !pagamento || pagamento === "0" || !total || total === "0" || !produto || !quantidade) {
                req.flash("error_msg", "Por favor, preencha todos os campos obrigatórios.");
                return res.status(400).redirect("/pedidos/add");
            }

            for (let i = 0; i < produto.length; i++) {
                const prod = await ProdutoModel.findById(produto[i]);
                if (!prod) {
                    req.flash("error_msg", `Produto não encontrado para ID: ${produto[i]}`);
                    return res.status(404).redirect("/pedidos/add");
                }
                if (quantidade[i] > prod.quantidade) {
                    req.flash("error_msg", `Estoque insuficiente para o produto: ${prod.nome}`);
                    return res.status(400).redirect("/pedidos/add");
                }
            }

            const novoPedido = new PedidoModel({
                cliente,
                itens: produto.map((prodId, index) => ({ produto: prodId, quantidade: quantidade[index] })),
                pagamento,
                descricao,
                total
            });

            await novoPedido.save();

            for (let i = 0; i < produto.length; i++) {
                await ProdutoModel.findByIdAndUpdate(produto[i], { $inc: { quantidade: -quantidade[i] } });
            }

            req.flash("success_msg", "Pedido criado com sucesso!");
            res.redirect("/pedidos");
        } catch (error) {
            req.flash("error_msg", "Erro ao criar pedido, tente novamente.");
            res.status(500).redirect("/pedidos/add");
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
            const pedido = await Pedido.findOne({ _id: req.body.id });
            const { cliente, pagamento, descricao, total, produto, quantidade } = req.body;

            if (!cliente || cliente === "0" || !pagamento || pagamento === "0" || !total || total === "0" || !produto || !quantidade) {
                req.flash("error_msg", "Por favor, preencha todos os campos obrigatórios.");
                return res.status(400).redirect(`/pedidos/edit/${req.body.id}`);
            }

            for (let i = 0; i < produto.length; i++) {
                const prod = await ProdutoModel.findById(produto[i]);
                if (!prod) {
                    req.flash("error_msg", `Produto não encontrado para ID: ${produto[i]}`);
                    return res.status(404).redirect(`/pedidos/edit/${req.body.id}`);
                }
                // Verificar se a quantidade atual é suficiente para remover do estoque
                const diferencaQuantidade = quantidade[i] - pedido.itens[i].quantidade;
                if (diferencaQuantidade > prod.quantidade) {
                    req.flash("error_msg", `Estoque insuficiente para o produto: ${prod.nome}`);
                    return res.status(400).redirect(`/pedidos/edit/${req.body.id}`);
                }
            }

            for (let i = 0; i < produto.length; i++) {
                const diferencaQuantidade = quantidade[i] - pedido.itens[i].quantidade;
                if (diferencaQuantidade > 0) {
                    await ProdutoModel.findByIdAndUpdate(produto[i], { $inc: { quantidade: -diferencaQuantidade } });
                }
            }

            for (let i = 0; i < produto.length; i++) {
                const diferencaQuantidade = quantidade[i] - pedido.itens[i].quantidade;
                if (diferencaQuantidade < 0) {
                    await ProdutoModel.findByIdAndUpdate(produto[i], { $inc: { quantidade: -diferencaQuantidade } });
                }
            }

            pedido.cliente = cliente;
            pedido.itens = produto.map((prodId, index) => ({ produto: prodId, quantidade: quantidade[index] }));
            pedido.pagamento = pagamento;
            pedido.descricao = descricao;
            pedido.total = total;

            await pedido.save();

            req.flash("success_msg", "Pedido editado com sucesso!");
            res.redirect("/pedidos");
        } catch (error) {
            req.flash("error_msg", "Houve um erro ao editar o pedido");
            res.status(500).redirect(`/pedidos/edit/${req.body.id}`);
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