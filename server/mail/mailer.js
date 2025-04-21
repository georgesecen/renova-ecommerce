const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    //email used for testing
    host: 'smtp.ethereal.email',
    secure:false,
    port: 587,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

const sendEmail = async (from,to, subject, text) => {

    try {
        const info = await transporter.sendMail({
            from, //sender email
            to, // receiver email
            subject, // email subject
            html: `<p>${text}</p>`, // email content in HTML format
          });
          console.log("✅ Email sent successfully:", info.messageId);
        
    } catch (error) {
        console.error("❌ Email send failed:", error);
        
    }
};

module.exports = sendEmail;