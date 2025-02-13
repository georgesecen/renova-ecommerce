// // // authMiddleware.js
const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log("Received token:", token);
    if (!token) {
        // For testing, allow unauthenticated requests to pass
        // You can mock a user here if you want to simulate a logged-in user
        //TODO comment out this block when login is set up
        req.user = { id: 2, username: 'backyardcaveman' };  // Mock user
        return next();
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error('JWT verification error:', err);
            return res.status(403).send({ error: 'Invalid or expired token.' });
        }
        req.user = user;
        next();
    });
};
//
// module.exports = authenticateJWT;

// const authenticateJWT = (req, res, next) => {
//     const token = req.header('Authorization')?.replace('Bearer ', '');
//     console.log("Received token:", token);
//
//     if (!token) {
//         console.warn("No token provided. Proceeding as unauthenticated user.");
//
//         // Optional: Allow unauthenticated requests to pass in a development/test environment
//         if (process.env.ALLOW_UNAUTHENTICATED === 'true') {
//             req.user = null;  // No user assigned
//             return next();
//         }
//
//         return res.status(401).json({ error: 'Authentication required' });
//     }
//
//     jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
//         if (err) {
//             console.error('JWT verification error:', err);
//             return res.status(403).json({ error: 'Invalid or expired token' });
//         }
//
//         console.log("Decoded JWT:", decodedToken);
//
//         // Ensure the token contains a valid user ID before attaching it to the request
//         if (!decodedToken.id) {
//             return res.status(400).json({ error: 'Invalid token structure' });
//         }
//
//         req.user = decodedToken;  // Assign decoded user to req.user
//         next();
//     });
// };

module.exports = authenticateJWT;
