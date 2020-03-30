const sequelize = require("../db");
const { Sequelize, Model } = require("sequelize");

class Discussion extends Model { }

const discussionSchema = {
    reply: {
        type: Sequelize.STRING(50000),
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
    user: {
        type: Sequelize.INTEGER,
        allownull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    }
};

Discussion.init(discussionSchema, {
    sequelize,
    tableName: "discussions"
})

module.exports = Discussion;