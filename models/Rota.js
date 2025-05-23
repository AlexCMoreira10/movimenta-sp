import db from './db.js';

const Rota = db.sequelize.define('Rota', {
  idrota: {
    type: db.Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  nome_rota: {
    type: db.Sequelize.STRING(100),
    allowNull: true
  },
  descricao: {
    type: db.Sequelize.TEXT,
    allowNull: true
  },
  idterminal_origem: {
    type: db.Sequelize.INTEGER,
    allowNull: true
  },
  idterminal_destino: {
    type: db.Sequelize.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'rotas',
  timestamps: false
});

export default Rota;



