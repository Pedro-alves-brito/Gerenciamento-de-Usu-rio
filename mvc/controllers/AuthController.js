const AuthModel = require("../models/AuthModel");

class AuthController {
    constructor(app, pool) {
        this.app = app;
        this.authModel = new AuthModel(pool);

        // Rota de login
        app.get("/login", (req, res) => {
            res.render("Auth/Login", { erro: req.session.error });
            delete req.session.error;
        });

        app.post("/login", async (req, res) => {
            const { usuario, senha } = req.body;

            if (!usuario || !senha) {
                req.session.error = 'Usuário e senha são obrigatórios';
                return res.redirect('/login');
            }

            const result = await this.authModel.login(usuario, senha);
            
            if (result.success) {
                req.session.user = result.user;
                req.session.isAuthenticated = true;
                return res.redirect('/');
            } else {
                req.session.error = result.message;
                return res.redirect('/login');
            }
        });

        // Rota de logout
        app.get('/logout', (req, res) => {
            req.session.destroy();
            res.redirect('/login');
        });
    }
}

module.exports = AuthController;