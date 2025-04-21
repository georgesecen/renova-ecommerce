const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    let token = req.cookies?.jwt;  // Retrieve token from cookies

    console.log("Received token:", token);
    console.log(req.cookies);

    if (!token) {
        console.warn("No token provided. Proceeding as unauthenticated user.");

        const guestUserId = req.body.guest_user_id || req.query.guest_user_id || req.headers['guest-user-id'];

        if (guestUserId) {
            console.log("Guest user detected:", guestUserId);
            req.user = { guestUserId, isGuest: true };
            return next();
        }

        return res.status(401).json({ error: 'Authentication required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                console.log("Access token expired. Attempting to refresh...");
                return refreshAccessToken(req, res, next);
            }
            return res.status(403).json({ message: 'Invalid token' });
        }

        req.user = decoded;
        next();
    });
};

const refreshAccessToken = (req, res, next) => {
    const refreshToken = req.cookies?.refreshToken || req.headers['x-refresh-token'];

    if (!refreshToken) {
        return res.status(401).json({ message: 'No refresh token provided' });
    }

    jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        const newAccessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '15m' });

        // Conditionally secure cookie based on the environment
        const isProduction = process.env.NODE_ENV === 'production';

        res.cookie('jwt', newAccessToken, {
            httpOnly: true,
            secure: isProduction, // Only use secure cookies in production
            sameSite: 'lax'
        });

        req.user = decoded;
        next();
    });
};

module.exports = authenticateJWT;
