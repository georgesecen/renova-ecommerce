const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    // let token = req.header('Authorization')?.replace('Bearer ', '');
    let token = req.cookies?.jwt;
    console.log("Received token:", token);
    // console.log(req.headers['authorization']);
    console.log(req.cookies)
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

    // jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    //     if (err) {
    //         console.error('JWT verification error:', err);
    //         return res.status(403).json({ error: 'Invalid or expired token' });
    //     }
    //
    //     // Ensure the token contains a valid user ID before attaching it to the request
    //     if (!decodedToken.userId) {
    //         return res.status(400).json({ error: 'Invalid token structure' });
    //     }
    //
    //     req.user = decodedToken.userId;  // Assign decoded user to req.user
    //     next();
    // });
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
// Function to refresh the access token
const refreshAccessToken = (req, res, next) => {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ message: 'No refresh token' });
    }

    jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Invalid refresh token' });

        // Generate new access token
        const newAccessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '15m' });

        res.cookie('jwt', newAccessToken, { httpOnly: true, secure: true, sameSite: 'lax' });

        req.user = decoded;
        next();
    });
};

module.exports = authenticateJWT;
