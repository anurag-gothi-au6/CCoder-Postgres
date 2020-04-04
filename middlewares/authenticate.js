const User = require('../models/User');
const { verify } = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try {
        const authToken = req.params.token;
        if(authToken) {
            const token = await verify(authToken, process.env.JWT_SECRET_KEY);
            const user = await User.findOne({ where:{ id : token.id}});
            req.user = user.dataValues
            next()
        }
    } catch (err) {
        console.log(err.message)
        res.send('Server Error');
    }
}
