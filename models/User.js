const sequelize = require("../db");
const { Sequelize, Model } = require("sequelize");
const { hash, compare } = require("bcryptjs");
const { sign } = require("jsonwebtoken");



class User extends Model {
    static async findByEmailAndPassword(email, password) {
      try {
        const user = await User.findOne({
          where: {
            email
          }
        });
        if (!user) throw new Error("Incorrect credentials");
        const isMatched = await compare(password, user.password);
        if (!isMatched) throw new Error("Incorrect credentials");
        return user;
      } catch (err) {
        err.name = 'AuthError'
        throw err;
      }
    }
    static async nullifyToken(token){
        try {
            const user = await User.findOne({
                where:{accessToken: token}
            })
            user.accessToken = null;
            await user.update({ accessToken: null });
            return user
        } catch (err) {
            console.log(err.message)   
        }
    }
    async generateAuthToken() {
        const user = this;
        
        const accessToken = await sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "24h"
        });
        await user.update({ accessToken: accessToken });
        return accessToken;
    }
  }

const userSchema = (
    {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        username:{
            type: Sequelize.STRING,
            allowNull: false,
            unique:true
        },
        email:{
            type: Sequelize.STRING,
            allowNull: false,
            unique:true
        },
        password: {
            type: Sequelize.STRING,
            allowNull:  function() {
                return !this.isThirdPartyUser;
              },
        },
        experience:{
            type: Sequelize.STRING
        },
        education: {
            type: Sequelize.STRING
        },
        accessToken: {
            type: Sequelize.STRING
        },
        isThirdPartyUser: {
            type: Sequelize.BOOLEAN,
            allowNull: false
          }
    }
);

User.init(userSchema, {
    sequelize,
    tableName: "users"
  });
User.beforeCreate(async user => {
    const hashedPassword = await hash(user.password, 10);
    user.password = hashedPassword;
  });
User.beforeUpdate(async user => {
    if (user.changed("password")) {
      const hashedPassword = await hash(user.password, 10);
      user.password = hashedPassword;
    }
  });

module.exports = User;