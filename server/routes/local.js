const express = require("express");

const User = require("../models/User");
const {
    sendThankYouEmail,
    sendPasswordResetEmail,
} = require("../utils/sendEmail");

const passport = require("passport");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs")


// Loads .env into process.env
dotenv.config();

const router = express.Router();
router.use(express.json());

// GET /local/test
router.get("/test", (req, res) => {
    res.send("Hello World!");
});

// POST /local/login authenticates users using the local passport strategy
router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user) => {
        if (err) {
            res.status(500).json({ error: "An error occurred during authentication" });
        }
        if (!user) {
            res.status(400).json({ error: "Your email or password is incorrect" });
        } else {
            req.login(user, (err) => {
                if (err) {
                    res.status(500).json({ error: "An error occurred during login" });
                }
                res.status(200).json({
                    id: req.user.id,
                    displayName: req.user.displayName,
                    email: req.user.email,
                });
            });
        }
    })(req, res, next);
});

// POST /local/register will verify a users submitted registration form and registers them to the user database
router.post("/register", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (user) {
            res.status(400).json({ error: "A user already exists with that email" });
        } else {
            const { displayName, email, password, confirmPassword } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            if (password === confirmPassword) {
                const newUser = new User({
                    displayName: displayName,
                    email: email,
                    password: hashedPassword,
                });
                const savedNewUser = await newUser.save();
                sendThankYouEmail(savedNewUser.email, savedNewUser.displayName);
                res.status(200).json({ success: "Registered successfully" });
            } else {
                res.status(400).json({
                    error: "Registration failed due to mismatching passwords",
                });
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "An error occurred during registration" });
    }
});

// POST /local/sendResetEmail emails a user with a link to reset their password
router.post("/sendResetEmail", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            sendPasswordResetEmail(user.email, user._id);
            res.status(200).json({
                success: "An email containing instructions on how to reset your password has been sent",
            });
        } else {
            res.status(400).json({ error: "No account is associated to that email" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "An error occurred while sending the reset email" });
    }
});

// POST /local/resetPassword updates a users stored and hashed password
router.post("/resetPassword", async (req, res) => {
    const { _id, newPassword, confirmPassword } = req.body;
    // hash and salt new password with bcrypt
    const newPasswordHashed = await bcrypt.hash(newPassword, 10);
    // find user associated with userid, update password
    try {
        if (newPassword === confirmPassword) {
            const updatedPassword = await User.findOneAndUpdate(
                { _id: _id },
                { $set: { password: newPasswordHashed } },
                { new: true },
            );
            if (updatedPassword) {
                res.status(200).json({ success: "Password successfully updated" });
            } else {
                res.status(400).json({ error:"Invalid user identification" });
            }
        } else {
            res.status(400).json({
                error: "Registration failed due to mismatching passwords",
            });
        }
    } catch (err) {
        console.log(err);
        res.status(400).json({ error:"An error occurred during password reset" });
    }
});

// GET /local/logout will log a user out
// A callback function for error handling must be passed to req.logout due to the asynchronicity of the logout method
router.get("/logout", (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.status(200).redirect(`${process.env.CLIENT_URL}`);
    });
});

module.exports = router;
