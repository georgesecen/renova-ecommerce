const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    //email used for testing
    host: process.env.EMAIL_HOST,
    secure:false,
    port: 587,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

const sendEmail = async (from,to, subject, html) => {

    try {
        const info = await transporter.sendMail({
            from, //sender email
            to, // receiver email
            subject, // email subject
            html:      `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Thank You for Registering</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f7f7f7;
                        margin: 0;
                        padding: 20px;
                        
                    }
                    h1 {
                        color: #4CAF50;
                    }
                    p {
                        font-size: 16px;
                        color: #333333;
                    }
                    a {
                        display: inline-block;
                        padding: 12px 25px;
                        background-color: #4CAF50;
                        color: #ffffff;
                        text-decoration: none;
                        font-weight: bold;
                        border-radius: 4px;
                        margin-top: 20px;
                    }
                    a:hover {
                        background-color: #45a049;
                    }

                </style>
            </head>
            <body>
                ${html}
       
            </body>
            </html>`
            // html: `<p>${text}</p>`, // email content in HTML format

          });
          console.log("✅ Email sent successfully:", info.messageId);
        
    } catch (error) {
        console.error("❌ Email send failed:", error);
        
    }
};

module.exports = sendEmail;
