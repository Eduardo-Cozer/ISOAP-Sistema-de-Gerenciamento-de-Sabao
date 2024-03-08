import ProdutoModel from "../models/Produto.js"

class Produto extends ProdutoModel {
    constructor() {
        super()
    }
  
    async list(req, res) {
        try {
            const produtos = await Produto.find()
            res.render("produtos/produtos", { produtos })
        } catch (err) {
            req.flash("error_msg", "Houve um erro ao listar produtos")
            res.status(500).redirect("/home")
        }
    }
  
    addPage(req, res) {
        res.render("produtos/addprodutos")
    }
  
    async add(req, res) {
        const { nome, preco, quantidade } = req.body
        const erros = []

        if (!nome || !preco || !quantidade) {
            erros.push({ texto: "Preencha todos os campos obrigatórios." })
        }
    
        if (erros.length > 0) {
            res.status(400).render("produtos/addprodutos", { erros })
        } else {
            try {
                const novoProduto = new ProdutoModel({ nome, preco, quantidade })
                await novoProduto.save()
                req.flash("success_msg", "Produto cadastrado com sucesso!")
                res.redirect("/produtos")
            } catch (err) {
                req.flash("error_msg", "Houve um erro ao salvar produto, tente novamente!")
                res.status(500).redirect("/produtos/add")
            }
        }
    }
  
    async editPage(req, res) {
        try {
            const produto = await Produto.findOne({ _id: req.params.id })
            res.render("produtos/editprodutos", { produto })
        } catch (err) {
            req.flash("error_msg", "Este produto não existe")
            res.status(404).redirect("/produtos")
        }
    }
  
    async edit(req, res) {
        const { id, nome, preco, quantidade } = req.body
        const erros = []
        
        if (!nome || !preco || !quantidade) {
            erros.push({ texto: "Preencha todos os campos obrigatórios." })
        }
    
        if (erros.length > 0) {
            try {
                const produto = await Produto.findOne({ _id: id })
                if (produto) {
                    res.render("produtos/editprodutos", { produto, erros })
                } else {
                    req.flash("error_msg", "Este produto não existe")
                    res.status(404).redirect("/produtos")
                }
            } catch (err) {
                req.flash("error_msg", "Houve um erro interno ao buscar o produto")
                res.status(500).redirect("/produtos")
            }
        } else {
            try {
                const produtoAtualizado = await Produto.findOneAndUpdate(
                    { _id: id },
                    { nome, preco, quantidade},
                    { new: true }
                )
                if (produtoAtualizado) {
                    req.flash("success_msg", "Produto editado com sucesso!")
                    res.redirect("/produtos")
                } else {
                    req.flash("error_msg", "Este produto não existe")
                    res.status(404).redirect("/produtos")
                }
            } catch (err) {
                req.flash("error_msg", "Houve um erro interno ao editar produto")
                res.status(500).redirect("/produtos")
            }
        }
    }
  
    async delete(req, res) {
        try {
            await Produto.deleteOne({ _id: req.body.id })
            req.flash("success_msg", "Produto deletado com sucesso!")
            res.redirect("/produtos")
        } catch (err) {
            req.flash("error_msg", "Houve um erro ao deletar o produto")
            res.status(500).redirect("/produtos")
        }
    }
}

export default Produto