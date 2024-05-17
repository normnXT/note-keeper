const passport = require("passport");
const express = require("express");

const router = express.Router();
router.use(express.json());

router.get("/login/success", (req, res) => {
    if (req.user) {
        res.status(200).json({
            error: false,
            message: "Successfully logged in",
            user: req.user,
        });
    } else {
        res.status(403).json({ error: true, message: "Not authorized" });
    }
});

router.get("/login/failed", (req, res) => {
    res.status(401).json({
        error: true,
        message: "Login failure",
    });
});

router.get("/google", passport.authenticate("google", ["profile", "email"]));

router.get(
    "/google/callback",
    passport.authenticate("google", {
        successRedirect: "http://localhost:3000",
        failureRedirect: "/login/failed",
    }),
);

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("http://localhost:3000");
});

module.exports = router;
