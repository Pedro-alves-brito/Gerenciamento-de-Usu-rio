const Create_Account = require("../models/Create_AccountModel")

class Create_AccountController {
    constructor(app, pool) {
        this.app = app;
        this.Create_AccountModel = new Create_Account(pool);

        // Rota de login
        app.get("/create", (req, res) => {
            res.render("CreateCount/Create", { erro: req.session.error });
            delete req.session.error;
        });

        app.post("/create", async (req, res) => {
            const { usuario, senha } = req.body;

            if (!usuario || !senha) {
                req.session.error = 'Usuário e senha são obrigatórios';
                return res.redirect('/create');
            }

            const result = await this.Create_AccountModel.create(usuario, senha);
            
            if (result.success) {
                return res.redirect('/login');
            } else {
                req.session.error = result.message;
                return res.redirect('/create');
            }
        });

        // Rota de logout
        app.get('/logout', (req, res) => {
            req.session.destroy();
            res.redirect('/login');
        });
    }
}

module.exports = Create_AccountController;