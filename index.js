const express = require("express");
const mysql2 = require("mysql2/promise");
const path = require("path");
const session = require('express-session');
const HomeController = require("./mvc/controllers/HomeController");
const AuthController = require("./mvc/controllers/AuthController");
const Create_AccountController = require("./mvc/controllers/Create_AccountController");

class Server
{
    app
    port = 3000
    mysql
    pool

    constructor(){
        this.app = express()
        this.mysql = mysql2

        this.Configue()
        this.CreatePoll()
        this.Strat()
        this.On()
    }

    Strat(){
        new HomeController(this.app);
        new AuthController(this.app, this.pool);
        new Create_AccountController(this.app, this.pool)
    }

    Configue(){

        // Configuração básica do Express
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json());
        this.app.use(express.static(path.join(__dirname, "mvc/views/public")));
        this.app.set("view engine", "ejs");
        this.app.set("views", path.join(__dirname, "mvc/views"));

        // Configuração de sessão simplificada
        this.app.use(session({
            secret: 'segredoSimplesParaSessao',
            resave: false,
            saveUninitialized: true
        }));

        // Middleware para passar dados do usuário para as views
        this.app.use((req, res, next) => {
            res.locals.user = req.session.user;
            res.locals.isAuthenticated = req.session.isAuthenticated;
            next();
        });
    }

    CreatePoll(){
        this.pool = this.mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'game_sanitizacao',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }

    On(){
        // Rota de erro 404
        this.app.use((req, res) => {
            res.status(404).render('error/404');
        });

        // Inicia o servidor
        this.app.listen(this.port)
    }
}

new Server()