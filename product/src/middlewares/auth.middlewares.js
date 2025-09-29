const jwt = require('jsonwebtoken');

function  createauthMiddleware(role=['user']) {
    return function authMiddleware(req, res, next) {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        console.log(req.cookies)
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        try {
            const decoded = jwt.verify(token, process.env.jwt); // Use your actual secret
            if (!role.includes(decoded.role)) {
                return res.status(403).json({ message: 'Forbidden: Insufficient rights' });
            }
            req.user = decoded; // Attach user info to request object
            next();
        } catch (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    };   

}
module.exports ={ createauthMiddleware}