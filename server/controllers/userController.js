const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

exports.register = async (req, res) => {
    const { email, password, username,uuid } = req.body;
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
            username,
            email,
            password: hashedPassword,
            uuid
        })
        return res.status(201).json({message:"User registered successfully"})

    } catch (e) {
        console.log(e);
        return res.status(500).json({ error: "Error registering user" });
    }

};

exports.login = async(req, res) => {
    const { email, password } = req.body;
    console.log(email);
    try {
        const foundUserByEmail = await userModel.findOne({ where: { email } });
        if (foundUserByEmail) {
            const isMatch = bcrypt.compareSync(password, foundUserByEmail.dataValues.password);
            if (!isMatch) {
                return res.status(400).json({error: 'Invalid password'});
            }
            // const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            // res.json({ token });
            return res.status(200).json({ message: "User successfully logged in" });
        } else {
            return res.status(400).json({error: 'Invalid email'});
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({ error: "Error logging in user" });
    }

    // userModel.findByEmail(email, (err, result) => {
    //     if (err || result.length === 0) {
    //         return res.status(400).json({ message: 'Invalid email or password' });
    //     }

    //     const user = result[0];
    //     const isMatch = bcrypt.compareSync(password, user.password);
    //     if (!isMatch) {
    //         return res.status(400).json({message: 'Invalid email or password'});
    //     }
    //     const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    //     res.json({ token });
    // });
};