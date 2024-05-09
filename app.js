import express from "express"
import handlebars from "express-handlebars"
import path from "path"
import mongoose from "mongoose"
import flash from "connect-flash"
import session from "express-session"
import passport from "passport"
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import Auth  from "./config/auth.js"
import AdminMiddleware from "./helpers/eAdmin.js"
import Despesa from './controllers/Despesa.js'
import Cliente from './controllers/Cliente.js'
import Produto from './controllers/Produto.js'
import Pedido from './controllers/Pedido.js'
import Usuario from './controllers/Usuario.js'

class App {
    constructor() {
        this.app = express()
        this.middlewares()
        this.database()
        this.routes(new Produto(), new Pedido(), new Cliente(), new Usuario(), new Despesa())
    }

    middlewares() {
        this.app.use(session({
            secret: "anything",
            resave: true,
            saveUninitialized: true
        }))
        const auth = new Auth(passport)
        auth.initialize()
        this.app.use(passport.initialize())
        this.app.use(passport.session())
        this.app.use(flash())

        this.app.use((req, res, next) => {
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            res.locals.error = req.flash("error")
            res.locals.user = req.user || null
            next()
        })

        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(express.json())

        this.app.engine("handlebars", handlebars.engine({ defaultLayout: 'main', runtimeOptions: { allowProtoPropertiesByDefault: true, allowProtoMethodsByDefault: true } }))
        this.app.set("view engine", "handlebars")

        this.app.use(express.static(path.join(dirname(fileURLToPath(import.meta.url)), "public")))
    }

    routes(produtoInstance, pedidoInstance, clienteInstance, usuarioInstance, despesaInstance) {
        this.app.get('/home', (req, res) => pedidoInstance.home(req, res))

        this.app.get('/', (req, res) => usuarioInstance.loginPage(req, res))
        this.app.post('/usuarios/login', (req, res, next) => usuarioInstance.login(req, res, next));
        this.app.get('/usuarios/add', AdminMiddleware.checkAdmin, (req, res) => usuarioInstance.registerPage(req, res));
        this.app.post('/usuarios/novo', AdminMiddleware.checkAdmin, (req, res) => usuarioInstance.register(req, res));
        this.app.get('/usuarios/logout', AdminMiddleware.checkAdmin, (req, res) => usuarioInstance.logout(req, res));
        this.app.get('/usuarios/delete', AdminMiddleware.checkAdmin, (req, res) => usuarioInstance.deletePage(req, res));
        this.app.post('/usuarios/deletar', AdminMiddleware.checkAdmin,(req, res, next) => usuarioInstance.delete(req, res, next));

        this.app.get('/clientes', AdminMiddleware.checkAdmin,(req, res) => clienteInstance.list(req, res))
        this.app.get('/clientes/add', AdminMiddleware.checkAdmin,(req, res) => clienteInstance.addPage(req, res))
        this.app.post("/clientes/novo", AdminMiddleware.checkAdmin,(req, res) => clienteInstance.add(req, res))
        this.app.get("/clientes/edit/:id", AdminMiddleware.checkAdmin,(req, res) => clienteInstance.editPage(req, res))
        this.app.post("/clientes/edit", AdminMiddleware.checkAdmin,(req, res) => clienteInstance.edit(req, res))
        this.app.post("/clientes/deletar", AdminMiddleware.checkAdmin,(req, res) => clienteInstance.delete(req, res))

        this.app.get('/produtos', AdminMiddleware.checkAdmin,(req, res) => produtoInstance.list(req, res))
        this.app.get('/produtos/add', AdminMiddleware.checkAdmin,(req, res) => produtoInstance.addPage(req, res))
        this.app.post("/produtos/novo", AdminMiddleware.checkAdmin,(req, res) => produtoInstance.add(req, res))
        this.app.get("/produtos/edit/:id", AdminMiddleware.checkAdmin,(req, res) => produtoInstance.editPage(req, res))
        this.app.post("/produtos/edit", AdminMiddleware.checkAdmin,(req, res) => produtoInstance.edit(req, res))
        this.app.post("/produtos/deletar", AdminMiddleware.checkAdmin,(req, res) => produtoInstance.delete(req, res))

        this.app.get('/pedidos', AdminMiddleware.checkAdmin,(req, res) => pedidoInstance.list(req, res))
        this.app.get('/pedidos/add', AdminMiddleware.checkAdmin,(req, res) => pedidoInstance.addPage(req, res))
        this.app.post("/pedidos/novo", AdminMiddleware.checkAdmin,(req, res) => pedidoInstance.add(req, res))
        this.app.get('/pedidos/edit/:id', AdminMiddleware.checkAdmin,(req, res) => pedidoInstance.editPage(req, res))
        this.app.post("/pedidos/edit", AdminMiddleware.checkAdmin,(req, res) => pedidoInstance.edit(req, res))
        this.app.get("/pedidos/deletar/:id", AdminMiddleware.checkAdmin,(req, res) => pedidoInstance.delete(req, res))

        this.app.get('/despesas', AdminMiddleware.checkAdmin,(req, res) => despesaInstance.list(req, res))
        this.app.get('/despesas/add', AdminMiddleware.checkAdmin,(req, res) => despesaInstance.addPage(req, res))
        this.app.post("/despesas/novo", AdminMiddleware.checkAdmin,(req, res) => despesaInstance.add(req, res))
        this.app.get('/despesas/edit/:id', AdminMiddleware.checkAdmin,(req, res) => despesaInstance.editPage(req, res))
        this.app.post("/despesas/edit", AdminMiddleware.checkAdmin,(req, res) => despesaInstance.edit(req, res))
        this.app.post("/despesas/deletar", AdminMiddleware.checkAdmin,(req, res) => despesaInstance.delete(req, res))
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