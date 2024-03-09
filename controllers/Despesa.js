import DespesaModel from "../models/Despesa.js"

class Despesa extends DespesaModel {
    constructor() {
        super()
    }
  
    async list(req, res) {
        try {
            const despesas = await Despesa.find()
            res.render("Despesas/Despesas", { despesas })
        } catch (err) {
            req.flash("error_msg", "Houve um erro ao listar Despesas")
            res.status(500).redirect("/home")
        }
    }
  
    addPage(req, res) {
        res.render("Despesas/addDespesas")
    }
  
    async add(req, res) {
        const { nome, preco, descricao } = req.body
        const erros = []

        if (!nome || !preco) {
            erros.push({ texto: "Preencha todos os campos obrigatórios." })
        }
    
        if (erros.length > 0) {
            res.status(400).render("Despesas/addDespesas", { erros })
        } else {
            try {
                const novoDespesa = new DespesaModel({ nome, preco, descricao })
                await novoDespesa.save()
                req.flash("success_msg", "Despesa cadastrada com sucesso!")
                res.redirect("/Despesas")
            } catch (err) {
                req.flash("error_msg", "Houve um erro ao salvar Despesa, tente novamente!")
                res.status(500).redirect("/Despesas/add")
            }
        }
    }
  
    async editPage(req, res) {
        try {
            const despesa = await Despesa.findOne({ _id: req.params.id })
            res.render("Despesas/editDespesas", { despesa })
        } catch (err) {
            req.flash("error_msg", "Esta Despesa não existe")
            res.status(404).redirect("/Despesas")
        }
    }
  
    async edit(req, res) {
        const { id, nome, preco, descricao} = req.body
        const erros = []
        
        if (!nome || !preco ) {
            erros.push({ texto: "Preencha todos os campos obrigatórios." })
        }
    
        if (erros.length > 0) {
            try {
                const despesa = await Despesa.findOne({ _id: id })
                if (despesa) {
                    res.render("Despesas/editDespesas", { despesa, erros })
                } else {
                    req.flash("error_msg", "Esta Despesa não existe")
                    res.status(404).redirect("/Despesas")
                }
            } catch (err) {
                req.flash("error_msg", "Houve um erro interno ao buscar a Despesa")
                res.status(500).redirect("/Despesas")
            }
        } else {
            try {
                const despesaAtualizada = await Despesa.findOneAndUpdate(
                    { _id: id },
                    { nome, preco, descricao},
                    { new: true }
                )
                if (despesaAtualizada) {
                    req.flash("success_msg", "Despesa editado com sucesso!")
                    res.redirect("/Despesas")
                } else {
                    req.flash("error_msg", "Esta Despesa não existe")
                    res.status(404).redirect("/Despesas")
                }
            } catch (err) {
                req.flash("error_msg", "Houve um erro interno ao editar Despesa")
                res.status(500).redirect("/Despesas")
            }
        }
    }
  
    async delete(req, res) {
        try {
            await Despesa.deleteOne({ _id: req.body.id })
            req.flash("success_msg", "Despesa deletada com sucesso!")
            res.redirect("/Despesas")
        } catch (err) {
            req.flash("error_msg", "Houve um erro ao deletar a Despesa")
            res.status(500).redirect("/Despesas")
        }
    }
}

export default Despesa