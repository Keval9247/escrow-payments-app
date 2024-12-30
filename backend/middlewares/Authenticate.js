const authenticate = (req, res, next) => {
    if (req.session && req.session.user) {
        req.user = req.session.user;
        console.log("🚀 User authenticated via session:", req.user);
        return next();
    }

    return res.status(401).json({ error: "Unauthorized: Please log in." });
};

module.exports = authenticate;

