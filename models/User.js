const sequelize = require("../db");
const { Sequelize, Model } = require("sequelize");
const { hash, compare } = require("bcryptjs");
const { sign, verify } = require("jsonwebtoken");
const sendMail = require("../utils/mailer");
// const bcrypt = require("bcryptjs");



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
    static async findByPassword (accessToken, oldpassword) {
        try {
            const user = await User.findOne({where:{accessToken:accessToken}});
            if(!user) throw new Error("Invalid Credentials");
            const isMatched = await compare(oldpassword, user.password);
            if(!isMatched) throw new Error("Invalid Credentials");
            return user;
        } catch (err) {
            err.name = 'AuthError';
            throw err;
        }
    };
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
    };

    static async findByEmail(email) {
      try {
        const user = await User.findOne({ where: {
          email: email } 
        })
        if(!user) throw new Error("Invalid Credentials");
        return user
      } catch (err) {
        err.name = 'AuthError';
        throw err
      }
    };

    static async findByToken(token) {
      try {
        const user = await User.findOne({
          where: {
            accessToken: token
          }
        });
        if(!user) throw new Error("Invalid Credentials");
        const payload = await verify(token, process.env.JWT_SECRET_KEY);
        console.log(payload);
        if(payload) {
          user.verified = true;
          user.save()
          return user
        }
      } catch (err) {
        console.log(err.message);
        err.name = "Invalid Credentials";
        throw err
      }
    }


    async generateAuthToken(mode) {
        const user = this;
        
        if(mode === "confirm") {
          const accessToken = await sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
              expiresIn: "24h"
          });
          user.accessToken = accessToken;
          await user.save();
          await sendMail(mode, user.email, accessToken);
      } else if( mode === "reset") {
          const resetToken = await sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
              expiresIn: "3m"
          });
          user.resetToken = resetToken;
          await user.save();
          await sendMail(mode, user.email,resetToken);
      }
    }

    async regenerateAuthToken() {
      const user = this

      const token = await sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
          expiresIn: "24h"
      });
      
      user.accessToken = token;
      await user.save()
      return token
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
        resetToken: {
          type: Sequelize.STRING,
          defaultValue: ""
        },
        verified: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },
        fileUpload: {
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
    if(user.password !== undefined){ 
    const hashedPassword = await hash(user.password, 10);
    user.password = hashedPassword;
    }
  });
User.beforeUpdate(async user => {
    if (user.changed("password")) {
      const hashedPassword = await hash(user.password, 10);
      user.password = hashedPassword;
    }
  });


module.exports = User;