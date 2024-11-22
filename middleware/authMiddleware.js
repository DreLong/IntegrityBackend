// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Failed to authenticate token' });
        }

        // Check if the token contains the necessary user information
        if (!decoded || !decoded.uuid) {
            return res.status(400).json({ message: 'Invalid token structure or missing user data' });
        }

        console.log('Authenticated User:', decoded); // For debugging
        req.user = decoded; // Attach decoded user data to the request
        next();
    });
};

module.exports = authMiddleware;
