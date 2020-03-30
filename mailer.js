const nodemailer = require("nodemailer");

let transport =  nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port:465,
    secure: true,
    auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD
    }
})

transport.verify((error, success) => {
    if(error) {
        console.log(error);
    } else {
        console.log('Server is ready to take our messages');
    }
})

module.exports = transport