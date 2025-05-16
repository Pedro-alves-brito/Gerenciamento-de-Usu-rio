
class Jogador
{

    nome 
    vidas

    constructor(nome, vidas)
    {
        this.nome = nome
        this.vidas = vidas
    }

    atacar(oponente)
    {
        oponente.vidas -= 1

        if(oponente.vidas <= 0)
        {
            oponente.vidas = 0            
        }

    }
}


module.exports = Jogador

