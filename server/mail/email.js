const express = require("express");
const sendEmail = require("./mailer");

const router = express.Router();

router.post("/send-email", async (req, res) => {
    const { to, subject, text } = req.body;

    try {
        await sendEmail(to, subject, text);
        res.json({ success: true, message: "Email sent successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, error: "Email sending failed!" });
    }
});

module.exports = router;
