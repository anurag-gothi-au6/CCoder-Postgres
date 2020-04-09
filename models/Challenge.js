const sequelize = require("../db");
const { Sequelize, Model } = require("sequelize");  

class Challenge extends Model {}

const challengeSchema = ({
    name: {
        type: Sequelize.TEXT,
        allownull: false,
        unique: true
    },
    description: {
        type: Sequelize.TEXT
    },
    question: {
        type: Sequelize.TEXT,
        allownull: false
    },
    constraints: {
        type: Sequelize.TEXT,
        allownull: false
    },
    func_name: {
        type: Sequelize.TEXT,
        allownull: false
    },
    no_of_args: {
        type: Sequelize.INTEGER,
        allownull: false
    },
    func_py: {
        type: Sequelize.TEXT,
        allownull: false
    },
    func_node: {
        type: Sequelize.TEXT,
        allownull: false
    },
    func_java: {
        type: Sequelize.TEXT,
        allownull: false
      },
      func_cpp: {
        type: Sequelize.TEXT,
        allownull: false
      },
      func_c: {
        type: Sequelize.TEXT,
        allownull: false
      },
      output: {
        type: Sequelize.TEXT,
        allownull: false

      },
      input: {
        type: Sequelize.TEXT,
        allownull: false
      },
      editorial: {
        type: Sequelize.TEXT
      },
      maxScore: {
        type: Sequelize.INTEGER,
        allownull: false
      },
    createdBy: {
        type: Sequelize.INTEGER,
        allownull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    contest: {
        type: Sequelize.INTEGER,
        allownull: false,
        references: {
            model: 'contests',
            key: 'id'
        },
        defaultValue:null
    }

});

Challenge.init(challengeSchema, {
    sequelize,
    tableName: "challenges"
})

module.exports = {
  Challenge: Challenge
}