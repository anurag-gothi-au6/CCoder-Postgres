const Sequelize = require("sequelize");
const { POSTGRES_URI, POSTGRES_PASSWORD } = process.env;

const sequelize = new Sequelize(
  POSTGRES_URI.replace("<password>", POSTGRES_PASSWORD)
);

sequelize.sync();

sequelize
  .authenticate()
  .then(() => console.log("Connection success!"))
  .catch(err => console.log(`Error: ${err.message}`));

module.exports = sequelize;
