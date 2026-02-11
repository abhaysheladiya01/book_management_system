const Sequelize = require('sequelize');

const sequelize = new Sequelize('node_complete', 'abhay', 'your_pswd', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;