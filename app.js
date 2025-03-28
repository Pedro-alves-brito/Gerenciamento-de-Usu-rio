const express = require("express");
const path = require("path");
const mysql = require('mysql2/promise');

const App = express();

// Configurar EJS
App.set("view engine", "ejs");
App.set("views", path.join(__dirname, "mvc/views"));
App.use(express.static(path.join(__dirname, "public")));

// Middleware para processar dados do formulário
App.use(express.urlencoded({ extended: true }));
App.use(express.json());

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', // Adicione sua senha do MySQL se houver
    database: 'dengue'
});

// Página inicial
App.get("/", async (req, res) => {
    
});

// Página de login
App.get("/login", (req, res) => {
    res.render("login", { 
        erro: null,
        layout: false // Se estiver usando layouts
    });
});

// Processar login
App.post("/logar", async (req, res) => {
    const { email, Senha } = req.body;

    try {
        // Consulta ao banco para verificar usuário e senha JUNTOS
        const [rows] = await pool.query(
            'SELECT * FROM usuario WHERE email = ? AND senha = ?',
            [email, Senha]  // Comparação direta
        );

        console.log('Resultado da consulta:', rows);

        if (rows.length > 0) {
            const usuario = rows[0]; // Armazena o usuário encontrado
            
            if (usuario.autenticado === 1){
                // Para admin - mostra todos os usuários (exemplo)
                const [todosUsuarios] = await pool.query('SELECT id, nome, senha, email, grupo, autenticado FROM usuario');
                const [grupos] = await pool.query('SELECT id, nome FROM grupo');
                res.render("index", {
                    nome: usuario.nome, // Mostra o nome do admin
                    texto: "Modo Administrador",
                    usuarios: todosUsuarios, // Envia a lista formatada
                    grupo: grupos
                });
            } else {
                // Para usuário normal
                res.render("home", {
                    usuarios: usuario
                });
            }
            
        } else {
            res.render("error");
        }

    } catch (err) {
        console.error("Erro no login:", err);
        res.render("login", { 
            erro: "Erro no servidor. Tente novamente." 
        });
    }
});


// Rota para exibir página de cadastro (GET)
App.post("/excluir", async (req, res) => {
    const {idconta} = req.body;

    try {
        // Atualiza senha (em texto puro)
        await pool.query(
            'DELETE FROM  usuario WHERE id = ?',
            [idconta]
        );
        console.log(idconta)
        res.redirect("/login")
        
    } catch (err) {
        console.error("Erro no login:", err);
        res.render("login", { 
            erro: "Erro no servidor. Tente novamente." 
        });
    }
});

App.get("/cadastro", async (req, res) =>{
    const [grupos] = await pool.query('SELECT id, nome FROM grupo');
    res.render("cadastro", {
        erro: null,
        grupo: grupos
    });
})

// Rota para processar cadastro (POST)
App.post("/cadastrar", async (req, res) => {
    const { conta, Senha, email, grupo, autenticado } = req.body;

    try {
        // Verifica se usuário já existe
        const [rows] = await pool.query(
            'SELECT * FROM usuario WHERE email = ?',
            [email]
        );

        if (rows.length > 0) {
            return res.render("cadastro", {
                erro: "Usuário já existe!"
            });
        }

        // Insere no banco (senha em texto puro)
        await pool.query(
            'INSERT INTO usuario (nome, senha, email, grupo, autenticado) VALUES (?, ?, ?, ?, ?)',
            [conta, Senha, email, grupo, autenticado]
        );

        res.redirect("/login");

    } catch (err) {
        console.error("Erro no cadastro:", err);
        res.render("login", {
            erro: "Erro ao cadastrar. Tente novamente."
        });
    }
});

// Rota para processar recuperação (POST)
App.post("/atualzar", async (req, res) => {
    const { conta, idconta, Senha, email, grupo, autenticado } = req.body;

    try {

        // Atualiza senha (em texto puro)
        await pool.query(
            'UPDATE usuario SET senha = ?, nome = ?, email = ?, grupo = ?, autenticado = ? WHERE id = ?',
            [Senha, conta, email, grupo, autenticado, idconta]
        );
        console.log(conta, idconta, Senha, email, grupo)
        res.redirect("/login")

    } catch (err) {
        console.error("Erro ao recuperar senha:", err);
        res.render("login", {
            erro: "Erro ao alterar. Tente novamente.",
            sucesso: null
        });
    }
});

// Rota para a página de erro
App.get("/error", (req, res) => {
    res.render("error");
});

App.post('/logout', (req, res) => {
    res.redirect('/');
});

// Iniciar servidor
App.listen(3000, () => console.log("Aplicação ON na porta 3000"));