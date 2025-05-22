import teste_db from './teste_db.js';

const teste = teste_db.sequelize.define("teste", {
  Nome: {
    type: db.Sequelize.STRING(20),
    allowNull: false,
    unique: true,
    validate: {
      len: [1, 20]
    }
  }
});
export default teste