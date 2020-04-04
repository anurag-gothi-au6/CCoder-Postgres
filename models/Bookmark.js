const sequelize = require("../db");
const { Sequelize, Model } = require("sequelize");  

class Bookmark extends Model {}

const bookmarkSchema = {
    challengeId : {
        type: Sequelize.INTEGER,
        allownull: false,
        references: {
            model: 'challenges',
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

Bookmark.init(bookmarkSchema, {
    sequelize,
    tableName: "bookmarks"
})


module.exports = Bookmark;