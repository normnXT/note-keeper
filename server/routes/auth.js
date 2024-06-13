const passport = require("passport");
const express = require("express");
const dotenv = require("dotenv");

const router = express.Router();
router.use(express.json());

dotenv.config();

router.get("/login/success", (req, res) => {
    if (req.user) {
        res.status(200).json({
            user: req.user,
        });
    } else {
        res.status(403).send("Not authorized");
    }
});

router.get("/login/failed", (req, res) => {
    res.status(401).send("Login failure");
});

router.get("/google", passport.authenticate("google", ["profile", "email"]));

router.get(
    "/google/callback",
    passport.authenticate("google", {
        successRedirect: process.env.CLIENT_URL,
        failureRedirect: `${process.env.CLIENT_URL}/auth/login/failed`,
    }),
);

router.get("/logout", (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect(`${process.env.CLIENT_URL}`);
    });
});

module.exports = router;
