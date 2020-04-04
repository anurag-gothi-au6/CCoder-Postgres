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

const sendMailToUser = async (mode, email, token) => {
    const domainName = process.env.DOMAIN_NAME || `http://localhost:1234`;
    // console.log(token)
    //console.log("hi", mode);
    let html = null;
    if(mode === "confirm")
        html = `
        <h1>Welcome to CCoder</h1>
        <p> Thanks for creating an account. Click
            <a href=${domainName}/confirm/${token}>here</a> to confirm your account. or copy paste
            ${domainName}/confirm/${token} to your browser
        </p>`;
    
    else if(mode === 'reset')
        html = `<h1>Hi there.</h1>
        <p>You have recently requested for a change in password. Click 
            <a href=${domainName}/reset/${token}>here</a> to reset your password. Or copy paste ${domainName}/reset/${token} to your browser. If you didnt initiate the request. Kindly ignore. Thanks :)
        </p>`;
    
    try {
        await transport.sendMail({
            from: process.env.GMAIL_EMAIL,
            to: email,
            subject:
                mode === "confirm" ? "confirm your email" : "Reset your password",
            html
        });
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = sendMailToUser