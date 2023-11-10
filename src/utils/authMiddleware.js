const jwt = require("jsonwebtoken");
require("dotenv").config()
const jwtSecret = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
    try {
        let token = req.headers.authorization;
        if (token) {
            if (token.startsWith('bearer ')) {
                token = token.slice(7, token.length);
            }
            let decoded = jwt.verify(token, jwtSecret);
            req.decoded = decoded;
        } else {
            return res.status(401).json({ error: "Unauthorized user", data: null, message: "Unauthorized user" });
        }
        next();
    } catch (error) {
        return res.status(500).json({ error: error.message || error, data: null, message: "Authorization failed" });
    }
};

module.exports = { authMiddleware };
