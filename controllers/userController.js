const User = require('../models/User');
const bcrypt = require("bcryptjs");
const { validationResult}=require("express-validator");
const { verify } = require("jsonwebtoken");
const cloudinary = require("../utils/cloudinary");
const convertBufferToString = require("../utils/convertBufferToString");

module.exports = {
    async userRegister(req, res) {
        const errors = validationResult(req)
            if (!errors.isEmpty()) {
              return res.status(422).json({ errors: errors.array() })
        }
        try {
            const {name, username,email, password, experience, education} = req.body;
            if(!email || !password || !name ){
                return res.status(400).send({ statusCode: 400, message: "Bad request"});
            }
            const createUser = await User.create({name, username,email, password, experience, education,isThirdPartyUser: false});
            await createUser.generateAuthToken("confirm");
            res.status(201).json({
                statusCode:201,
                createUser,
                expiresIn: "24h"
            });
        } catch (err) {
            console.log(err.message)
            res.status(500).send('Server Error');
        }
    },

    async verifyUserEmail(req, res) {
        try {
            const confirmToken = req.params.token;
            const user = await User.findByToken(confirmToken);
            res.json(user);
        } catch (err) {
            console.log(err.message);
            res.status(500).send("server error");
        }    
    },

    async userLogin(req, res) {
        try {
            const {email, password} = req.body;
            if(!email || !password) return res.status(400).json({statusCode:400, message: 'Invalid Credentials'});
            const user = await User.findByEmailAndPassword(email, password);
            if(user.verified === false) {
                return res.json({message: "Please verify your email first"});
            }else {
                const accessToken = await user.regenerateAuthToken();
                res.status(200).json({
                    statusCode:200,
                    user,
                    accessToken: accessToken,
                    expiresIn: "24h"
                });
            }
            
        } catch (err) {
            if(err.name === 'AuthError'){
                res.json({message: err.message})
            }
        }
    },

    async userLogout (req,res){
        try {
            const token = req.params.token
            const user = await User.nullifyToken(token);
            res.json({user, message: 'Logout successfully'});
            
        } catch (err) {
            console.log(err.message);
            res.status(500).send('Server Error');
        }
        
    },

    async singleUser(req, res){
        res.json(req.user)
    },

    async fetchUserFromGoogle(req, res) {
        const user = req.user;
        const accessToken = await user.generateAuthToken("confirm");
        // Send the token as a cookie ..
        res.cookie("accessToken", accessToken, {
          expires: new Date(Date.now() + 1000 * 60 * 60 * 12),
          httpOnly: true,
          sameSite: "none"
        });
        // Redirect to the clients route (http://localhost:1234)
        //res.redirect("http://localhost:1234/#dashboard");
        res.send("Received");
      },

      async fetchUserFromGithub(req, res) {
        const user = req.user;
        const accessToken = await user.generateAuthToken("confirm");
        // Send the token as a cookie ..
        res.cookie("accessToken", accessToken, {
          expires: new Date(Date.now() + 1000 * 60 * 60 * 12),
          httpOnly: true,
          sameSite: "none"
        });
        // Redirect to the clients route (http://localhost:1234)
        //res.redirect("http://localhost:1234/#dashboard");
        res.send("Received");
      },
    async userProfileUpdate(req, res){
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() })
        }

        try {
            const token = req.params.token
            // console.log(... req.body)
            const profileUpdate = await User.update(
                {...req.body},
                {where:{
                    accessToken:token
                }}
              )
            res.status(201).send(profileUpdate);
        } catch (err) {
            console.log(err.message);
            res.status(500).send('Server Error');
        }
    },

    async userChangePassword(req,res){
        const errors = validationResult(req)
        
        if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() })
    }
        try {
            const accessToken = req.params.token
            const {oldpassword, newpassword, confirmpassword} = req.body;
            const password = await User.findByPassword(accessToken, oldpassword);

            if(password === 'Invalid Credentials') {
                res.send(401).send('Bad Request')
            }else {
                if(newpassword === confirmpassword){
                    const hashedpassword = await bcrypt.hash(newpassword, 10);
                    const resetPassword = await User.update(
                        {password:hashedpassword},
                        {where:{
                            accessToken:accessToken
                        }}
                      );
                    res.status(200).send(resetPassword)
                }
                else {
                    res.status(401).send('Bad Request')
                }
            }
        } catch (err) {
            console.log(err.message);
            res.status(500).send('Server Error')
        }
    },

    async userImageUpdate(req, res) {
        const user = req.user;
        const token = req.params.token
        try {
            let imageContent = convertBufferToString(
                req.file.originalname,
                req.file.buffer
              );
            let imageResponse = await cloudinary.uploader.upload(imageContent);
            await User.update(
                {fileUpload: imageResponse.secure_url},
                {where:{
                    accessToken: token
                }}
              );
            res.send("Image uploaded Successfully");
            
        } catch (err) {
            console.log(err.message);
            res.send("Server Error");
        }
    },

    async forgotPassword(req, res) {
        const { email } = req.body;
        if(!email) return res.status(400).send("Email is required");
        const user = await User.findByEmail( email );
        console.log(user.dataValues.verified)
        if(user.dataValues.verified === false) {
            return res.json({message: "please verify your email first"});
        }
        try {
            if(!user) {
                res.status(401).send('There is no user present. Kindly register');
            }
            else {
                await user.generateAuthToken("reset");
                res.send("Email sent Successfully. check your inbox");
            }
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Server Error");
        }
    },

    async updateForgotPassword(req,res) {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
        }
        const { resetToken } = req.params;
        const {newpassword , confirmpassword} = req.body;
        if(newpassword !== confirmpassword) return res.send("password doesn't match");
        try {
            const payload = await verify(resetToken, process.env.JWT_SECRET_KEY);
            if(payload) {
                const user = await User.findOne({ where:
                    { resetToken: resetToken}
                });
                user.dataValues.password = newpassword
                user.save()
                res.send("password successfully changed");
            }
        } catch (err) {
            console.log(err.message);
            res.send("Server Error");
        }
    }
}