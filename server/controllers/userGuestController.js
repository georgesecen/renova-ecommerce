const userGuest = require('../models/guestUserModel');

exports.createUserGuest = async (req, res) => {
    try {
        const { session_token, expiry } = req.body;

        if(!session_token || !expiry) {
            return res.status(200).json({ message: 'user credential missing', session_token });
        }

        const existingUser = await userGuest.findOne({where: { session_token }});
        if (existingUser) {
            return res.status(200).json({
                message: 'Session already exists',
                guestUserId: existingUser.id, });
        }

        const newUser = await userGuest.create({session_token, expires_at: expiry})
        return res.status(201).json({
            message: 'Guest user created',
            guestUserId: newUser.id });
    } catch(error) {
        console.error('Error creating guest:', error);
    }
}

exports.getGuestUser = async (req, res) => {
    try {
        const { guestUserId } = req.params;  // Get ID from request params
        console.log('Fetching Guest User ID:', guestUserId);

        if (!guestUserId) {
            return res.status(400).json({ message: 'Guest user ID is required' });
        }

        const guestUser = await userGuest.findByPk(guestUserId);  // Find by primary key (ID)

        if (!guestUser) {
            return res.status(404).json({ message: 'Guest user not found' });
        }

        return res.status(200).json(guestUser);
    } catch (error) {
        console.error('Error fetching guest user:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};
