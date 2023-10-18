const jwt = require('jsonwebtoken')

const requireSignin = (req, res, next) => {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1];
            const user = jwt.verify(token, process.env.JWT_SECRET);
            if (user) {
                req.userDataFromMiddleware = user.data;

            } else {
                return res.status(400).json({ messsage: "Token expired" })
            }
        }
        else {
            return res.status(400).json({ messsage: "Authorization required" })
        }

        next();
    }
    catch (err) {
        return res.status(401).json({ data: err })
    }
}

module.exports = { requireSignin }