import {Sequelize} from "sequelize"

const sequelize = new Sequelize("Movimenta_sp", "root", '', {
  //cadastro nome, root local e o lugar vazio a senha de acesso
    host: "localhost",
    dialect: "mysql"
})

export default {
    Sequelize: Sequelize,
    sequelize: sequelize
};


//aqui é somente isso.
//Lembra as regras ?

//Nome do data base , root, Senha