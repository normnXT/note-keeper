const passport = require("passport");
const express = require("express");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const {
    sendThankYouEmail,
    sendPasswordResetEmail,
} = require("../utils/sendEmail");

const router = express.Router();
router.use(express.json());

dotenv.config();

// GET /local/test
router.get("/test", (req, res) => {
    res.send("Hello World!");
});

// log the user in using local passport strategy
router.post("/login", (req, res, next) => {
    // authenticate the user using our local passport strategy
    passport.authenticate("local", (err, user) => {
        if (err) {
            res.send(err);
        }
        // if authentication failed
        if (!user) {
            res.status(400).send("Your email or password is incorrect");
        } else {
            req.login(user, (err) => {
                if (err) {
                    throw err;
                }
                // if no errors, log in is successful, send user details to client
                res.status(200).send({
                    id: req.user.id,
                    displayName: req.user.displayName,
                    email: req.user.email,
                });
            });
        }
    })(req, res, next);
});

// /register is an HTTP POST method. Client POSTS register form data to backend to be created as a user.
// accepts form inputs from frontend register page
router.post("/register", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (user) {
            res.status(400).send("A user already exists with that email");
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
                res.status(200).send("Registered successfully");
            } else {
                res.status(400).send(
                    "Registration failed due to mismatching passwords",
                );
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("An error occurred during registration");
    }
});

router.post("/sendResetEmail", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        // if user was found
        if (user) {
            sendPasswordResetEmail(user.email, user._id);
            res.status(200).send(
                "An email containing instructions on how to reset your password has been sent",
            );
        } else {
            // if no user was found
            res.status(400).send("No account is associated to that email");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("An error occurred while sending the reset email");
    }
});

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
                res.status(200).send("Password successfully updated");
            } else {
                res.status(400).send("Invalid userID");
            }
        } else {
            res.status(400).send(
                "Registration failed due to mismatching passwords",
            );
        }
    } catch (err) {
        console.log(err);
        res.status(400).send("An error occurred during password reset");
    }
});

router.get("/logout", (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.status(200).redirect(`${process.env.CLIENT_URL}`);
    });
});

module.exports = router;
