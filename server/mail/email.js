const express = require("express");
const sendEmail = require("./mailer");

const router = express.Router();

router.post("/send-email", async (req, res) => {
    const { email, subject, text, } = req.body;

    try {
        //sends a email from user to EMAIL_USER
        await sendEmail(email,process.env.EMAIL_USER, subject, text);
        res.json({ success: true, message: "Email sent successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, error: "Email sending failed!" });
    }
});

module.exports = router;
