import Sequelize from 'sequelize';

const db = new Sequelize('postgres://localhost:5432/senior_checkpoint', {
    logging: false
});

export default db;