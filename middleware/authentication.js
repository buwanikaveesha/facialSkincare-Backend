const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    try {
        const token = req.header("Authorization")?.split(" ")[1];
        if (!token) return res.status(403).send({ message: "Access Denied" });

        const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Invalid Token:", error.message);
        res.status(400).send({ message: "Invalid Token" });
    }
};

module.exports = auth;