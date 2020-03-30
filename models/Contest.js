const sequelize = require("../db");
const { Sequelize, Model } = require("sequelize");  

class Contest extends Model {}

const contestSchema = 
  {
    name: {
        type: Sequelize.TEXT,
        allownull: false,
        unique: true
    },
    startTime: {
        type: 'TIMESTAMP',
        allownull: false,
      },
    endTime: {
        type: 'TIMESTAMP',
        allownull: false,
    },
    organizationName: {
        type: Sequelize.TEXT
    },
    organizationType: {
        type: Sequelize.TEXT,
    },
    tagline: {
        type: Sequelize.TEXT,
    },
    description: {
        type: Sequelize.TEXT,
        allownull: false,
    },
    prizes: {
        type: Sequelize.TEXT,
          },
    rules: {
        type: Sequelize.TEXT,
    },
    scoring:{
        type:Sequelize.INTEGER
    },
    organizedBy: {
        type: Sequelize.INTEGER,
        allownull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    }
}
  
Contest.init(contestSchema, {
    sequelize,
    tableName: "contests"
})


module.exports = Contest;
