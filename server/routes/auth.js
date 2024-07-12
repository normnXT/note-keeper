const passport = require("passport");
const express = require("express");
const dotenv = require("dotenv");

// Loads .env into process.env
dotenv.config();

const router = express.Router();
router.use(express.json());

// GET /auth/login/success checks for an active user Google session
router.get("/login/success", (req, res) => {
    if (req.user) {
        res.status(200).json({
            user: req.user,
        });
    } else {
        res.status(403).send("Not authenticated");
    }
});

// GET /auth/login/failed notifies the client of login failure
router.get("/login/failed", (req, res) => {
    res.status(401).send("Login failure");
});

// GET /auth/google initiates the OAuth flow and identifies the permissions needed from the user
// Google will send an authorization code in response, and then the callback will be performed
router.get("/google", passport.authenticate("google", ["profile", "email"]));

// GET /auth/google/callback will use the authentication code to get an access token to make API requests on the users behalf
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: '/login/failed', prompt: 'consent',  accessType: 'offline' }),
    (req, res) => {
        console.log("Session after Google auth:", req.session);
        console.log("User after Google auth:", req.user);
        res.redirect(process.env.CLIENT_URL);
    },
);

// GET /auth/logout will log a user out
// A callback function for error handling must be passed to req.logout due to the asynchronicity of the logout method
router.post("/logout", (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect(`${process.env.CLIENT_URL}`);
    });
});

module.exports = router;
