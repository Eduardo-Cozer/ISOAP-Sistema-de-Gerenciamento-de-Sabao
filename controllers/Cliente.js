import ClienteModel from "../models/Cliente.js"

class Cliente extends ClienteModel {
    constructor() {
        super()
    }
  
    async list(req, res) {
        try {
            const clientes = await Cliente.find().sort({ date: "desc" })
            res.render("clientes/clientes", { clientes })
        } catch (err) {
            req.flash("error_msg", "Houve um erro ao listar clientes")
            res.status(500).redirect("/home")
        }
    }
  
    addPage(req, res) {
        res.render("clientes/addclientes")
    }
  
    async add(req, res) {
        const { nome, telefone, rua, numero, bairro, cidade, complemento } = req.body
        const erros = []
        
        if (!nome || !telefone || !rua || !numero || !bairro || !cidade) {
            erros.push({ texto: "Preencha todos os campos obrigatórios." })
        }

        const clienteExistente = await ClienteModel.findOne({ nome });
            if (clienteExistente) {
                req.flash("error_msg", "Já existe um cliente cadastrado com esse nome");
                return res.redirect("/clientes/add");
            }
    
        if (erros.length > 0) {
            res.status(400).render("clientes/addclientes", { erros })
        } else {
            try {
                const novoCliente = new ClienteModel({
                    nome,
                    telefone,
                    rua,
                    numero,
                    bairro,
                    cidade,
                    complemento
                })
    
                await novoCliente.save()
                req.flash("success_msg", "Cliente cadastrado com sucesso!")
                res.redirect("/clientes")
            } catch (err) {
                req.flash("error_msg", "Houve um erro ao salvar cliente, tente novamente!")
                res.status(500).redirect("/clientes/add")
            }
        }
    }
  
    async editPage(req, res) {
        try {
            const cliente = await Cliente.findOne({ _id: req.params.id })
            res.render("clientes/editclientes", { cliente })
        } catch (err) {
            req.flash("error_msg", "Este cliente não existe")
            res.status(404).redirect("/clientes")
        }
    }
  
    async edit(req, res) {
        const { id, nome, telefone, rua, numero, bairro, cidade, complemento } = req.body
        const erros = []
        
        if (!nome || !telefone || !rua || !numero || !bairro || !cidade) {
            erros.push({ texto: "Preencha todos os campos obrigatórios." })
        }
    
        if (erros.length > 0) {
            try {
                const cliente = await Cliente.findOne({ _id: id })
                if (cliente) {
                    res.render("clientes/editclientes", { cliente, erros })
                } else {
                    req.flash("error_msg", "Este cliente não existe")
                    res.status(404).redirect("/clientes")
                }
            } catch (err) {
                req.flash("error_msg", "Houve um erro interno ao buscar o cliente")
                res.status(500).redirect("/clientes")
            }
        } else {
            try {
                const cliente = await Cliente.findOne({ _id: id });
                if (!cliente) {
                    req.flash("error_msg", "Este cliente não existe");
                    return res.status(404).redirect("/clientes");
                }

                if (cliente.nome !== nome) {
                    const clienteExistente = await Cliente.findOne({ nome });
                    if (clienteExistente) {
                        req.flash("error_msg", "Já existe um cliente cadastrado com esse nome");
                        return res.redirect(`/clientes/edit/${id}`);
                    }
                }
                
                const clienteAtualizado = await Cliente.findOneAndUpdate(
                    { _id: id },
                    { nome, telefone, rua, numero, bairro, cidade, complemento },
                    { new: true }
                )
                if (clienteAtualizado) {
                    req.flash("success_msg", "Cliente editado com sucesso!")
                    res.redirect("/clientes")
                } else {
                    req.flash("error_msg", "Este cliente não existe")
                    res.status(404).redirect("/clientes")
                }
            } catch (err) {
                req.flash("error_msg", "Houve um erro interno ao editar cliente")
                res.status(500).redirect("/clientes")
            }
        }
    }
  
    async delete(req, res) {
        try {
            await Cliente.deleteOne({ _id: req.params.id })
            req.flash("success_msg", "Cliente deletado com sucesso!")
            res.redirect("/clientes")
        } catch (err) {
            req.flash("error_msg", "Houve um erro ao deletar o cliente")
            res.status(500).redirect("/clientes")
        }
    }
    
}

export default Cliente