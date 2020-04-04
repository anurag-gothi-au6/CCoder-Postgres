const sequelize = require("../db");
const { Sequelize, Model } = require("sequelize");  

class Moderator extends Model {}

const moderatorSchema = {
    contestId : {
        type: Sequelize.INTEGER,
        allownull: false,
        references: {
            model: 'contests',
            key: 'id'
        }
    },
    userId : {
        type: Sequelize.INTEGER,
        allownull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    }
};

Moderator.init(moderatorSchema, {
    sequelize,
    tableName: "moderators"
})


module.exports = Moderator;