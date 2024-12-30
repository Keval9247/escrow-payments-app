const superadminMiddleware = (req, res, next) => {
    if (req.user.role !== "superadmin") {
        return res.status(403).json({ error: "Access denied. Superadmin only." });
    }
    next();
};

module.exports = superadminMiddleware;
