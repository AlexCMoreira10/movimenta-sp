import db from './db.js'

const Cadastro = db.sequelize.define("Cadastro", {
  Telefone: {
    type: db.Sequelize.STRING(11),
    allowNull: false,
    unique: true,
    validate: {
      len: [11, 11]
    }
  }
});

//Cadastro.sync({force: true});

export default Cadastro
