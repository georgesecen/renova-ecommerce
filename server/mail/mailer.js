require("dotenv").config();
const sgMail = require("@sendgrid/mail");

// Set SendGrid API Key
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);
sgMail.setApiKey('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');

// Function to Send Email
const sendEmail = async (to, subject, text) => {
    try {
        const msg = {
            to,
            from: "fstcam@outlook.com",
            subject,
            text,
        };

        await sgMail.send(msg);
        console.log("✅ Email sent successfully!");
    } catch (error) {
        console.error("❌ Email send failed:", error);
    }
};

module.exports = sendEmail;
