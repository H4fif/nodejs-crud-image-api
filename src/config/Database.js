const { Sequelize } = require('sequelize');

const db = new Sequelize('nodejs_crud_image_api', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = db;