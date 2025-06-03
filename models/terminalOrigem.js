import db from './db.js';
import Onibus from './Onibus.js';
import Rota from './Rota.js';
import onibus_rotas_associadas from './OnibusRotasAssociadas.js';


const TerminalOrigem = db.sequelize.define('terminal_origem', {
    idterminal_origem: {
        type: db.Sequelize.INTEGER,
        allowNull: true
      },
})
export default TerminalOrigem;
//aqui não está sendo usado