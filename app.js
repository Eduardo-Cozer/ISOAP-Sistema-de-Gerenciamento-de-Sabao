import express from "express"
import handlebars from "express-handlebars"
import path from "path"
import mongoose from "mongoose"
import flash from "connect-flash"
import session from "express-session"
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import {eAdmin} from "./helpers/eAdmin.js"
import Cliente from './controllers/Cliente.js';
import Produto from './controllers/Produto.js';
import Pedido from './controllers/Pedido.js';
import Usuario from './controllers/Usuario.js'

class App {
    constructor() {
        this.app = express()
        this.middlewares()
        this.database()
        this.routes(new Produto(), new Pedido(), new Cliente(), new Usuario())
    }

    middlewares() {
        this.app.use(session({
        secret: "anything",
        resave: true,
        saveUninitialized: true
        }))
        this.app.use(flash())

        this.app.use((req, res, next) => {
        res.locals.success_msg = req.flash("success_msg")
        res.locals.error_msg = req.flash("error_msg")
        res.locals.error = req.flash("error")
        next()
        })

        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(express.json())

        this.app.engine("handlebars", handlebars.engine({ defaultLayout: 'main', runtimeOptions: { allowProtoPropertiesByDefault: true, allowProtoMethodsByDefault: true } }))
        this.app.set("view engine", "handlebars")

        this.app.use(express.static(path.join(dirname(fileURLToPath(import.meta.url)), "public")))
    }

    routes(produtoInstance, pedidoInstance, clienteInstance, usuarioInstance) {
        this.app.get('/', (req, res) => pedidoInstance.home(req, res))

        this.app.get('/usuarios', (req, res) => usuarioInstance.list(req, res));
        this.app.get('/usuarios/add', (req, res) => usuarioInstance.addPage(req, res));
        this.app.post('/usuarios/novo', (req, res) => usuarioInstance.add(req, res));
        this.app.get('/usuarios/edit/:id', (req, res) => usuarioInstance.editPage(req, res));
        this.app.post('/usuarios/edit', (req, res) => usuarioInstance.edit(req, res));
        this.app.post('/usuarios/deletar', (req, res) => usuarioInstance.delete(req, res));

        this.app.get('/clientes', (req, res) => clienteInstance.list(req, res))
        this.app.get('/clientes/add', (req, res) => clienteInstance.addPage(req, res))
        this.app.post("/clientes/novo", (req, res) => clienteInstance.add(req, res))
        this.app.get("/clientes/edit/:id", (req, res) => clienteInstance.editPage(req, res))
        this.app.post("/clientes/edit", (req, res) => clienteInstance.edit(req, res))
        this.app.post("/clientes/deletar", (req, res) => clienteInstance.delete(req, res))

        this.app.get('/produtos', (req, res) => produtoInstance.list(req, res))
        this.app.get('/produtos/add', (req, res) => produtoInstance.addPage(req, res))
        this.app.post("/produtos/novo", (req, res) => produtoInstance.add(req, res))
        this.app.get("/produtos/edit/:id", (req, res) => produtoInstance.editPage(req, res))
        this.app.post("/produtos/edit", (req, res) => produtoInstance.edit(req, res))
        this.app.post("/produtos/deletar", (req, res) => produtoInstance.delete(req, res))

        this.app.get('/pedidos', (req, res) => pedidoInstance.list(req, res))
        this.app.get('/pedidos/add', (req, res) => pedidoInstance.addPage(req, res))
        this.app.post("/pedidos/novo", (req, res) => pedidoInstance.add(req, res))
        this.app.get('/pedidos/edit/:id', (req, res) => pedidoInstance.editPage(req, res))
        this.app.post("/pedidos/edit", (req, res) => pedidoInstance.edit(req, res))
        this.app.get("/pedidos/deletar/:id", (req, res) => pedidoInstance.delete(req, res))
    }

    async database() {
        mongoose.Promise = global.Promise
        try {
        await mongoose.connect("mongodb://127.0.0.1:27017/isoap")
        console.log("Conectado com sucesso!")
        } catch (err) {
        console.log("Houve um erro: " + err)
        }
    }

    start() {
        const PORT = 8080
        this.app.listen(PORT, () => {
        console.log("Servidor rodando")
        })
    }
}

const server = new App()
server.start()