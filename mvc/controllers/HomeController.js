class HomeController {
    constructor(app) {
        // Middleware para verificar autenticação
        const checkAuth = (req, res, next) => {
            if (!req.session.isAuthenticated) {
                return res.redirect('/login');
            }
            next();
        };

        // Rota principal
        app.get('/', checkAuth, (req, res) => {
            res.render('Home/index', { user: req.session.user });
        });

        // Rota pública de exemplo
        app.get('/sobre', (req, res) => {
            res.render('Home/sobre');
        });
    }
}

module.exports = HomeController;