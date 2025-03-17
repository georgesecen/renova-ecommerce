const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const sendEmail = require("../mail/mailer");
require('dotenv').config();

exports.register = async (req, res) => {
    const { email, password, username, uuid } = req.body;
    console.log(email, password, username, uuid);

    if (!email || !password || !username) {
        return res.status(400).json({ error: 'Missing credentials' });
    }

    try {
        const foundUserByEmail = await userModel.findOne({ where: { email } });
        const foundUserByUsername = await userModel.findOne({ where: { username } });

        if (foundUserByEmail) {
            return res.status(400).json({ error: "Email is already registered" });
        }

        if (foundUserByUsername) {
            return res.status(400).json({ error: "Username is already registered" });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        await userModel.create({
            uuid,
            username,
            email,
            password: hashedPassword,
        });

        // Send confirmation registered email to the user
    //     sendEmail(process.env.EMAIL_USER, email, "Thank you for registering", 
      
    // `
    //             <h1>Welcome to Renova!</h1>
    //             <p>Hi there,</p>
    //             <p>Thank you for registering with Renova. We're excited to have you on board!</p>
    //             <p>To get started, please click the link below to log in to your account:</p>
    //             <p><a href="http://localhost:3000/signIn">Click here to log in</a></p> 
    //             <p>Best regards,<br>Renova Team</p>
    //         `
    //     );

        return res.status(201).json({ message: "User registered successfully" });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ error: "Error registering user" });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    console.log(email);

    try {
        const foundUserByEmail = await userModel.findOne({ where: { email } });

        if (foundUserByEmail) {
            const isMatch = bcrypt.compareSync(password, foundUserByEmail.dataValues.password);
            if (!isMatch) {
                return res.status(400).json({ error: 'Invalid password' });
            }

            const accessToken = jwt.sign(
                { userId: foundUserByEmail.id, role: foundUserByEmail.role },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            const refreshToken = jwt.sign(
                { userId: foundUserByEmail.id, role: foundUserByEmail.role },
                process.env.REFRESH_SECRET,
                { expiresIn: '7d' }
            );

            // Set JWT tokens in cookies
            res.cookie('jwt', accessToken, {
                httpOnly: true,  // Ensure the cookie is not accessible via JavaScript
                secure: process.env.NODE_ENV === "production",  // Use secure cookies in production
                sameSite: 'lax',
                maxAge: 1000 * 60 * 60 * 24,  // 1 day for access token
            });

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,  // Ensure the cookie is not accessible via JavaScript
                secure: process.env.NODE_ENV === "production",  // Use secure cookies in production
                sameSite: 'lax',
                maxAge: 1000 * 60 * 60 * 24 * 7,  // 7 days for refresh token
            });

            return res.status(200).json({ message: "User successfully logged in", token: accessToken });

        } else {
            return res.status(400).json({ error: 'Invalid email' });
        }

    } catch (e) {
        console.log(e);
        return res.status(500).json({ error: "Error logging in user" });
    }
};

exports.logout = async (req, res) => {
    try {
        res.clearCookie('jwt', {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'lax'
        });

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'lax'
        });
        res.status(200).json({ message: "User logged out" });

    } catch (error) {
        console.error(error, "There was an error logging out the your account");
        res.status(200).json({error: 'Error logging out'});
    }
}

exports.refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ error: 'Refresh token not found' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

        // Generate a new access token
        const newAccessToken = jwt.sign(
            { userId: decoded.userId, role: decoded.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }  // Access token expiration time
        );

        return res.status(200).json({ accessToken: newAccessToken });

    } catch (error) {
        console.error("Invalid or expired refresh token:", error);
        return res.status(403).json({ error: 'Invalid or expired refresh token' });
    }
};
