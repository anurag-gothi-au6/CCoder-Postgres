const sequelize = require("../db");
const { Sequelize, Model } = require("sequelize");

class TestCase extends Model { }

const testCaseSchema = {
    input: {
        type: Sequelize.TEXT,
        allownull: false
    },
    result: {
        type: Sequelize.TEXT,
        allownull: false
    },
    rawinput:{
        type: Sequelize.TEXT,
        allownull: false
    },
    challenge: {
        type: Sequelize.INTEGER,
        allownull: false,
        references: {
            model: 'challenges',
            key: 'id'
        }
    },
    user : {
        type: Sequelize.INTEGER,
        allownull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    }
};

TestCase.init(testCaseSchema, {
    sequelize,
    tableName: "testcases"
})

module.exports = TestCase;