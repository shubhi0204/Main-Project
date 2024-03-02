// sendEmail.js
require('dotenv').config();

const nodeMailer = require("nodemailer");

const sendEmail = async(options) => {
    const transporter = nodeMailer.createTransport({
        
        // host: 'smtp.gmail.com',
        // port: 465,
        // service: "gmail",
        // auth: {
        //     user:"shubhishuklaarmydreams@gmail.com",
        //     pass:"Shubhi@1432001"
        // },
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "waylon.rohan@ethereal.email", // generated ethereal user
            pass: "AG5RrVG2Hj1aTcfpcE" // generated ethereal password
        }
    });

    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
