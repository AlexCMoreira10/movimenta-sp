import db from './db.js';
import Onibus from './Onibus.js';
import Rota from './Rota.js';

const OnibusRotasAssociadas = db.sequelize.define('onibus_rotas_associadas', {
    idonibus: {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: Onibus,
            key: 'idonibus'
        }
    },
    origem_id: {
        type: db.Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: Rota,
            key: 'idrota'
        }
    },
    destino_id: {
        type: db.Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: Rota,
            key: 'idrota'
        }
    }
}, {
    tableName: 'onibus_rotas_associadas',
    timestamps: false
});

Onibus.sync()
Rota.sync()
OnibusRotasAssociadas.sync()

export default OnibusRotasAssociadas;

