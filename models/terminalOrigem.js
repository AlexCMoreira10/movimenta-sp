import db from './db.js';
import Onibus from './onibus.js';
import Rota from './Rota.js';
import onibus_rotas_associadas from './OnibusRotasAssociadas.js';


const terminalOrigem = db.sequelize.define('terminal_origem', {
    idterminal_origem: {
        type: db.Sequelize.INTEGER,
        allowNull: true
      };
})
export default terminal_origem;