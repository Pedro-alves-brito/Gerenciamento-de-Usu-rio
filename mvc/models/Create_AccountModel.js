const bcrypt = require('bcrypt');

class Create_AccountModel {
    constructor(pool) {
        this.pool = pool;
    }

    async create(usuario, senha) {
        try {

            // 1. Busca apenas pelo usuário
            const [rows] = await this.pool.execute(
                'SELECT id, usuario, senha_hash FROM usuarios WHERE usuario = ? LIMIT 1',
                [usuario]
            );

            if (rows.length === 1) {
                return { success: false, message: 'Usuário já existe!' };
            }

            const senha_hash = await bcrypt.hash(senha, 10)

            await this.pool.query(
                'INSERT INTO usuarios (usuario, senha_hash) VALUES (?, ?)',
                [usuario, senha_hash]
            );

            // 3. Retorna o usuário autenticado
            return {
                success: true
            };
        } catch (error) {
            console.error('Erro em criar conta:', error);
            return { success: false, message: 'Erro durante a criação' };
        }
    }
}

module.exports = Create_AccountModel;
