import db from './db.js';

const Onibus = db.sequelize.define('Onibus', {
    idonibus: {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    codigo_linha: {
        type: db.Sequelize.STRING(10),
        allowNull: true
    },
    numero_linha: {
        type: db.Sequelize.STRING(20),
        allowNull: true
    }
}, {
    tableName: 'onibus',
    timestamps: false
});

export default Onibus;

//idonibus, codigo_linha,numero_linha 