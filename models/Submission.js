const sequelize = require("../db");
const { Sequelize, Model } = require("sequelize");

class Submission extends Model { }

const submissionSchema = {
    user: {
        type: Sequelize.INTEGER,
        allownull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    language: {
        type: Sequelize.TEXT,
        allownull: false
    },
    code: {
        type: Sequelize.TEXT,
        allownull: false
    },
    score: {
        type: Sequelize.INTEGER,
        allownull: false
    },
    challenge: {
        type: Sequelize.INTEGER,
        allownull: false,
        references: {
            model: 'challenges',
            key: 'id'
        }
    }
};

Submission.init(submissionSchema, {
    sequelize,
    tableName: "submissions"
})

module.exports = Submission;