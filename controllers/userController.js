const User = require('../models/User');
const transport = require('../mailer');
const bcrypt = require("bcryptjs");
const { validationResult}=require("express-validator")

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
            const accessToken = await createUser.generateAuthToken();

            const mailer = await transport.sendMail({
                from: process.env.GMAIL_EMAIL,
                to: email,
                subject: "Mail from Ccoder",
                text:
                    `Hi ${name}, Thank you for Joining the Ccoder. Hope You can develop some problem solving skills.
                    
                    -with regards, Ccoder Team`
            })
            res.status(201).json({
                statusCode:201,
                createUser,
                accessToken: accessToken,
                mailer,
                expiresIn: "24h"
            });
        } catch (err) {
            console.log(err)
            res.status(500).send('Server Error');
        }
    },

    async userLogin(req, res) {
        try {
            const {email, password} = req.body;
            if(!email || !password) return res.status(400).json({statusCode:400, message: 'Invalid Credentials'});
            const user = await User.findByEmailAndPassword(email, password);
            const accessToken = await user.generateAuthToken();
            res.status(200).json({
                statusCode:200,
                user,
                accessToken: accessToken,
                expiresIn: "24h"
            });
            
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

    async userProfileUpdate(req, res){
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() })
        }
        try {
            const token = req.params.token

            const profileUpdate = await User.updateOne({accessToken: token},{...req.body},{new: true});
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
                    const resetPassword = await User.updateOne({accessToken: accessToken},{password: hashedpassword}, {new: true});
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

    async fetchUserFromGoogle(req, res) {
        const user = req.user;
        const accessToken = await user.generateAuthToken();
        // Send the token as a cookie ..
        res.cookie("accessToken", accessToken, {
          expires: new Date(Date.now() + 1000 * 60 * 60 * 12),
          httpOnly: true,
          sameSite: "none"
        });
        const mailer = await transport.sendMail({
            from: process.env.GMAIL_EMAIL,
            to: user.email,
            subject: "Mail from Ccoder",
            text:
                `Hi ${user.name}, Thank you for Joining the Ccoder. Hope You can develop some problem solving skills.
                
                -with regards, Ccoder Team`
        })
        // Redirect to the clients route (http://localhost:1234)
        //res.redirect("http://localhost:1234/#dashboard");
        res.send("Received");
      },

      async fetchUserFromGithub(req, res) {
        const user = req.user;
        const accessToken = await user.generateAuthToken();
        // Send the token as a cookie ..
        res.cookie("accessToken", accessToken, {
          expires: new Date(Date.now() + 1000 * 60 * 60 * 12),
          httpOnly: true,
          sameSite: "none"
        });
        const mailer = await transport.sendMail({
            from: process.env.GMAIL_EMAIL,
            to: user.email,
            subject: "Mail from Ccoder",
            text:
                `Hi ${user.name}, Thank you for Joining the Ccoder. Hope You can develop some problem solving skills.
                
                -with regards, Ccoder Team`
        })
        // Redirect to the clients route (http://localhost:1234)
        //res.redirect("http://localhost:1234/#dashboard");
        res.send("Received");
      }


}