const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    let token = req.header('Authorization')?.replace('Bearer ', '');
    console.log("Received token:", token);
    if(!token) {
        console.warn("No token in Authorization header. Checking cookies...");
        token = req.cookies.jwt;
    }

    if (!token) {
        console.warn("No token provided. Proceeding as unauthenticated user.");

        // Optional: Allow unauthenticated requests to pass in a development/test environment
        if (process.env.ALLOW_UNAUTHENTICATED === 'true') {
            req.user = null;  // No user assigned
            return next();
        }

        return res.status(401).json({ error: 'Authentication required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
            console.error('JWT verification error:', err);
            return res.status(403).json({ error: 'Invalid or expired token' });
        }

        // Ensure the token contains a valid user ID before attaching it to the request
        if (!decodedToken.userId) {
            return res.status(400).json({ error: 'Invalid token structure' });
        }

        req.user = decodedToken.userId;  // Assign decoded user to req.user
        next();
    });
};

module.exports = authenticateJWT;
