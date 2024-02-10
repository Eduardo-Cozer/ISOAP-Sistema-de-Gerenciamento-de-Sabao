import express from "express"
import handlebars from "express-handlebars"
import bodyParser from "body-parser"
import path from "path"
import mongoose from "mongoose"
import flash from "connect-flash"
import session from "express-session"
import ProdutoModel from "./models/Produto.js"
import PedidoModel from "./models/Pedido.js"
import ClienteModel from "./models/Cliente.js"

class App {
  constructor() {
    this.app = express()
    this.middlewares()
    this.database()
    this.routes();
  }

  middlewares() {
    this.app.use(session({
      secret: "anything",
      resave: true,
      saveUninitialized: true
    }));
    this.app.use(flash())

    this.app.use((req, res, next) => {
      res.locals.success_msg = req.flash("success_msg")
      res.locals.error_msg = req.flash("error_msg")
      res.locals.error = req.flash("error")
      next()
    })

    this.app.use(bodyParser.urlencoded({ extended: true }))
    this.app.use(bodyParser.json())

    this.app.engine("handlebars", handlebars.engine({ defaultLayout: 'main', runtimeOptions: { allowProtoPropertiesByDefault: true, allowProtoMethodsByDefault: true } }))
    this.app.set("view engine", "handlebars")

    this.app.use(express.static(path.join("C:/CIENCIA DA COMPUTACAO/Projetos/isoap", "public")))
  }

  routes() {
    // Instancie as classes aqui
    const pedidoInstance = new Pedido();
    const clienteInstance = new Cliente();
    const produtoInstance = new Produto();

    this.app.get('/', pedidoInstance.home.bind(pedidoInstance));

    // Routes for clients
    this.app.get('/clientes', clienteInstance.list.bind(clienteInstance));
    this.app.get('/clientes/add', clienteInstance.addPage.bind(clienteInstance));
    this.app.post("/clientes/novo", clienteInstance.add.bind(clienteInstance));
    this.app.get("/clientes/edit/:id", clienteInstance.editPage.bind(clienteInstance));
    this.app.post("/clientes/edit", clienteInstance.edit.bind(clienteInstance));
    this.app.post("/clientes/deletar", clienteInstance.delete.bind(clienteInstance));

    // Routes for products
    this.app.get('/produtos', produtoInstance.list.bind(produtoInstance));
    this.app.get('/produtos/add', produtoInstance.addPage.bind(produtoInstance));
    this.app.post("/produtos/novo", produtoInstance.add.bind(produtoInstance));
    this.app.get("/produtos/edit/:id", produtoInstance.editPage.bind(produtoInstance));
    this.app.post("/produtos/edit", produtoInstance.edit.bind(produtoInstance));
    this.app.post("/produtos/deletar", produtoInstance.delete.bind(produtoInstance));

    // Routes for requests (orders)
    this.app.get('/pedidos', pedidoInstance.list.bind(pedidoInstance));
    this.app.get('/pedidos/add', pedidoInstance.addPage.bind(pedidoInstance));
    this.app.post("/pedidos/novo", pedidoInstance.add.bind(pedidoInstance));
    this.app.get('/pedidos/edit/:id', pedidoInstance.editPage.bind(pedidoInstance));
    this.app.post("/pedidos/edit", pedidoInstance.edit.bind(pedidoInstance));
    this.app.get("/pedidos/deletar", pedidoInstance.delete.bind(pedidoInstance));
  }

  database() {
    mongoose.Promise = global.Promise;
    mongoose.connect("mongodb://127.0.0.1:27017/isoap")
      .then(() => {
        console.log("Conectado com sucesso!");
      }).catch((err) => {
        console.log("Houve um erro: " + err);
      });
  }

  start() {
    const PORT = 8080;
    this.app.listen(PORT, () => {
      console.log("Servidor rodando");
    });
  }
}

class Cliente extends ClienteModel {
    constructor() {
      super();
    }
  
    list(req, res) {
      Cliente.find().sort({ date: "desc" }).then((clientes) => {
        res.render("clientes/clientes", { clientes: clientes })
      }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar clientes")
        res.redirect("/")
      });
    }
  
    addPage(req, res) {
        res.render("clientes/addclientes")
    }
  
    add(req, res) {
        var erros = []
        
        if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
            erros.push({texto: "Nome inválido"})
        }
    
        if(!req.body.telefone || typeof req.body.telefone == undefined || req.body.telefone == null){
            erros.push({texto: "Telefone inválido"})
        }
    
        if(!req.body.rua || typeof req.body.rua == undefined || req.body.rua == null){
            erros.push({texto: "Rua inválida"})
        }
    
        if(!req.body.numero || typeof req.body.numero == undefined || req.body.numero == null){
            erros.push({texto: "Número inválido"})
        }
    
        if(!req.body.bairro || typeof req.body.bairro == undefined || req.body.bairro == null){
            erros.push({texto: "Bairro inválido"})
        }
    
        if(!req.body.cidade || typeof req.body.cidade == undefined || req.body.cidade == null){
            erros.push({texto: "Cidade inválida"})
        }
    
        if(erros.length > 0){
            res.render("clientes/addclientes", {erros: erros})
        }else{
            const novoCliente = {
                nome: req.body.nome,
                telefone: req.body.telefone,
                rua: req.body.rua,
                numero: req.body.numero,
                bairro: req.body.bairro,
                cidade: req.body.cidade,
                complemento: req.body.complemento
            }
            new ClienteModel(novoCliente).save()
            .then(() => {
                req.flash("success_msg", "Cliente cadastrado com sucesso!")
                res.redirect("/clientes")
            }).catch((err) => {
                req.flash("error_msg", "Houve um erro ao salvar cliente, tente novamente!")
                res.redirect("/clientes/add")
            })
        }
    }
  
    editPage(req, res) {
        Cliente.findOne({_id:req.params.id}).then((cliente) => {
            res.render("clientes/editclientes", {cliente: cliente})
        }).catch((err) => {
            req.flash("error_msg", "Este cliente não existe")
            res.redirect("/clientes")
        })
    }
  
    edit(req, res) {
        Cliente.findOne({_id: req.body.id}).then((cliente) => {
                
            var erros = []
    
            if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
                erros.push({texto: "Nome inválido"})
            }
        
            if(!req.body.telefone || typeof req.body.telefone == undefined || req.body.telefone == null){
                erros.push({texto: "Telefone inválido"})
            }
        
            if(!req.body.rua || typeof req.body.rua == undefined || req.body.rua == null){
                erros.push({texto: "Rua inválida"})
            }
        
            if(!req.body.numero || typeof req.body.numero == undefined || req.body.numero == null){
                erros.push({texto: "Número inválido"})
            }
        
            if(!req.body.bairro || typeof req.body.bairro == undefined || req.body.bairro == null){
                erros.push({texto: "Bairro inválido"})
            }
        
            if(!req.body.cidade || typeof req.body.cidade == undefined || req.body.cidade == null){
                erros.push({texto: "Cidade inválida"})
            }
    
            if(erros.length > 0){
                res.render("clientes/editclientes", {cliente: cliente, erros: erros})
            }else{
                cliente.nome = req.body.nome,
                cliente.telefone = req.body.telefone,
                cliente.rua = req.body.rua,
                cliente.numero = req.body.numero,
                cliente.bairro = req.body.bairro,
                cliente.cidade = req.body.cidade,
                cliente.complemento = req.body.complemento

                cliente.save().then(() => {
                    req.flash("success_msg", "Cliente editado com sucesso!")
                    res.redirect("/clientes")
                }).catch((err) => {
                    req.flash("error_msg", "Houve um erro interno ao editar cliente")
                    res.redirect("/clientes")
                })
            }
        }).catch((err) => {
            req.flash("error_msg", "Este cliente não existe")
            res.redirect("/clientes")
        })
    }
  
    delete(req, res) {
        Cliente.deleteOne({_id: req.body.id}).then(() => {
            req.flash("success_msg", "Cliente deletado com sucesso!")
            res.redirect("/clientes")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao deletar o cliente")
            res.redirect("/clientes")
        })
    }
  }
  
  class Produto extends ProdutoModel {
    constructor() {
      super();
    }
  
    list(req, res) {
      Produto.find().then((produtos) => {
        res.render("produtos/produtos", { produtos: produtos });
      }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar produtos");
        res.redirect("/");
      });
    }
  
    addPage(req, res) {
        res.render("produtos/addprodutos")
    }
  
    add(req, res) {
        var erros = []
        
        if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
            erros.push({texto: "Nome inválido"})
        }
    
        if(!req.body.preco || typeof req.body.preco == undefined || req.body.preco == null){
            erros.push({texto: "Preço inválido"})
        }
    
        if(erros.length > 0){
            res.render("produtos/addprodutos", {erros: erros})
        }else{
            console.log(req.body)
            const novoProduto = {
                nome: req.body.nome,
                preco: req.body.preco
            }
            new ProdutoModel(novoProduto).save()
            .then(() => {
                req.flash("success_msg", "Produto cadastrado com sucesso!")
                res.redirect("/produtos")
            }).catch((err) => {
                console.log(err)
                req.flash("error_msg", "Houve um erro ao salvar produto, tente novamente!")
                res.redirect("/produtos/add")
            })
        }
    }
  
    editPage(req, res) {
        Produto.findOne({_id:req.params.id}).then((produto) => {
            res.render("produtos/editprodutos", {produto: produto})
        }).catch((err) => {
            req.flash("error_msg", "Este produto não existe")
            res.redirect("/produtos")
        })
    }
  
    edit(req, res) {
        Produto.findOne({_id: req.body.id}).then((produto) => {
                
            var erros = []
    
            if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
                erros.push({texto: "Nome inválido"})
            }
        
            if(!req.body.preco || typeof req.body.preco == undefined || req.body.preco == null){
                erros.push({texto: "Preço inválido"})
            }    
    
            if(erros.length > 0){
                res.render("produtos/editprodutos", {produto: produto, erros: erros})
            }else{
                produto.nome = req.body.nome,
                produto.preco = req.body.preco

                produto.save().then(() => {
                    req.flash("success_msg", "Produto editado com sucesso!")
                    res.redirect("/produtos")
                }).catch((err) => {
                    req.flash("error_msg", "Houve um erro interno ao editar produto")
                    res.redirect("/produtos")
                })
            }
        }).catch((err) => {
            req.flash("error_msg", "Este produto não existe")
            res.redirect("/produtos")
        })
    }
  
    delete(req, res) {
        Produto.deleteOne({_id: req.body.id}).then(() => {
            req.flash("success_msg", "Produto deletado com sucesso!")
            res.redirect("/produtos")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao deletar o produto")
            res.redirect("/produtos")
        })
    }
  }

class Pedido extends PedidoModel {
  constructor() {
    super();
  }

  home(req, res) {
    Pedido.find()
        .populate({
            path: 'cliente',
            select: 'nome'
        })
        .populate({
            path: 'itens.produto',
            select: 'nome preco'
        })
        .sort({data: 'desc'}).then((pedidos) => {
            res.render('index', {pedidos});
        })
        .catch((err) => {
            req.flash('error_msg', 'Houve um erro ao exibir os pedidos recentes');
            console.log(err)
            res.redirect('/');
        });
  }

  list(req, res) {
    Pedido.find()
      .populate({
        path: 'cliente',
        select: 'nome'
      })
      .populate({
        path: 'itens.produto',
        select: 'nome preco'
      })
      .sort({ data: 'desc' }).then((pedidos) => {
        res.render('pedidos/pedidos', { pedidos });
      })
      .catch((err) => {
        req.flash('error_msg', 'Houve um erro ao listar pedidos');
        console.log(err)
        res.redirect('/');
      });
  }

  addPage(req, res) {
    Cliente.find().then((clientes) => {
        Produto.find().then((produtos) => {
            res.render("pedidos/addpedidos", {clientes: clientes, produtos: produtos})
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao carregar o formulário")
            res.redirect("/pedidos")
        })
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao carregar o formulário")
        res.redirect("/pedidos")
    })
  }

  async add(req, res){
    const {cliente, pagamento, descricao, total} = req.body
            const produtos = req.body.produto
            const quantidades = req.body.quantidade
        
            try{
                if(!cliente || cliente === "0" || !pagamento || pagamento === "0" || !total || total === "0" || !produtos || !quantidades){
                    req.flash("error_msg", "Por favor, preencha todos os campos obrigatórios.")
                    return res.redirect("/pedidos/add")
                }

                if(!Array.isArray(produtos) || !Array.isArray(quantidades) || produtos.length !== quantidades.length){
                    req.flash("error_msg", "Erro ao processar os produtos.")
                    return res.redirect("/pedidos/add")
                }

                let formaPagamento;
                if(req.body.pagamento === "1"){
                    formaPagamento = "Pix";
                }else if(req.body.pagamento === "2"){
                    formaPagamento = "Dinheiro";
                }else if(req.body.pagamento === "3"){
                    formaPagamento = "Cartão";
                }else{
                    formaPagamento = "Escolha...";
                }
        
                const itensPedido = []
        
                for(let i = 0; i < produtos.length; i++){
                    const itemPedido = {
                        produto: produtos[i],
                        quantidade: quantidades[i]
                    }
                    itensPedido.push(itemPedido);
                }

                const novoPedido = new PedidoModel({
                    cliente,
                    itens: itensPedido,
                    pagamento: formaPagamento,
                    descricao,
                    total
                });

                await novoPedido.save();
        
                req.flash("success_msg", "Pedido criado com sucesso!");
                res.redirect("/pedidos");
            }catch (err){
                console.error(err);
                req.flash("error_msg", "Erro ao criar pedido, tente novamente.");
                res.redirect("/pedidos/add");
            }
        }
  

  editPage(req, res) {
    Pedido.findOne({_id: req.params.id})
        .populate('cliente')
        .populate('itens.produto')
        .then((pedido) => {
            Cliente.find().then((clientes) => {
                Produto.find().then((produtos) => {
                    res.render("pedidos/editpedidos", {clientes: clientes, produtos: produtos, pedido: pedido})
                }).catch((err) => {
                    req.flash("error_msg", "Houve um erro ao listar produtos")
                    res.redirect("/pedidos")
                })
            }).catch((err) => {
                req.flash("error_msg", "Houve um erro ao listar clientes")
                res.redirect("/pedidos")
            })
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao carregar o formulário de edição")
            res.redirect("/pedidos")
        })
  }

  edit(req, res) {
    Pedido.findOne({_id: req.body.id})
    .populate('cliente')
    .populate('itens.produto')
    .then((pedido) => {
        Cliente.find().then((clientes) => {
            Produto.find().then((produtos) => {
                var erros = []

                if(!req.body.cliente || req.body.cliente === "0" || !req.body.pagamento || req.body.pagamento === "0" || !req.body.total || req.body.total === "0" || !req.body.produto || !req.body.quantidade){
                    erros.push({texto: "Por favor, preencha todos os campos obrigatórios."})
                }

                let formaPagamento;
                if(req.body.pagamento === "1" || req.body.pagamento === "Pix"){
                    formaPagamento = "Pix";
                }else if(req.body.pagamento === "2" || req.body.pagamento === "Dinheiro"){
                    formaPagamento = "Dinheiro";
                }else if(req.body.pagamento === "3" || req.body.pagamento === "Cartão"){
                    formaPagamento = "Cartão";
                }else{
                    formaPagamento = "Escolha...";
                }

                if(erros.length > 0){
                    res.render("pedidos/editpedidos", {erros: erros, clientes: clientes, produtos: produtos, pedido: pedido})
                }else{
                    pedido.cliente = req.body.cliente
                    pedido.itens = req.body.produto.map((produtoId, index) => ({
                        produto: produtoId,
                        quantidade: req.body.quantidade[index]
                    }))
                    pedido.pagamento = formaPagamento
                    pedido.descricao = req.body.descricao
                    pedido.total = req.body.total
                    
                    pedido.save().then(() => {
                        req.flash("success_msg", "Pedido editado com sucesso!")
                        res.redirect("/pedidos")
                    }).catch((err) => {
                        req.flash("error_msg", "Erro interno")
                        res.redirect("/pedidos")
                    })
                }
            }).catch((err) => {
                req.flash("error_msg", "Erro ao carregar produtos");
                res.redirect("/pedidos");
            });
        }).catch((err) => {
            req.flash("error_msg", "Erro ao carregar clientes")
            res.redirect("/pedidos")
        })
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao editar o pedido")
        res.redirect("/pedidos")
    })
  }

  delete(req, res) {
    Pedido.deleteOne({_id: req.params.id}).then(() => {
        req.flash("success_msg", "Pedido deletado com sucesso")
        res.redirect("/pedidos")
    }).catch((err) => {
        res.flash("error_msg", "Houve um erro ao deletar o pedido")
        res.redirect("/pedidos")
    })
  }
}

const server = new App();
server.start();