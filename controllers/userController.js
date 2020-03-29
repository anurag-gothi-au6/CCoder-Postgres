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
    }


}