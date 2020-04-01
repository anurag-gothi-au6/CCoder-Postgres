const sequelize = require("../db");
const { Sequelize, Model } = require("sequelize");  

class Signup extends Model {}

const signupSchema = {
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

Signup.init(signupSchema, {
    sequelize,
    tableName: "signups"
})


module.exports = Signup;