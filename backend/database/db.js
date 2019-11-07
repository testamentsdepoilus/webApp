const Sequelize = require("sequelize");
const db = {};
const sequelize = new Sequelize("admin", "root", "kikokaka75", {
  host: "localhost",
  dialect: "mysql"
});

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;
