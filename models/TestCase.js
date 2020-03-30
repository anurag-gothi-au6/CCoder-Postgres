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
    challenge: {
        type: Sequelize.TEXT,
        allownull: false,
        references: {
            model: 'challenges',
            key: 'id'
        }
    }
};

TestCase.init(testCaseSchema, {
    sequelize,
    tableName: "testcases"
})

module.exports = TestCase;