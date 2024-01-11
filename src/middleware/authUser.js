const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
    let token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: Token not provided' });
    }

    token = token.split(" ")[1]
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }

        req.user = user;
        next();
    });
};

module.exports = authenticateUser;
