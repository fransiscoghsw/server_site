// middleware/sessionMiddleware.js
module.exports = (req, res, next) => {
    if (req.url.startsWith("/admin")) {
        req.sessionType = "admin";
    }
    next();
};
