const passport = require("passport");
const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const {
    sendThankYouEmail,
    sendPasswordResetEmail
} = require("../utils/sendEmail");

const router = express.Router();
router.use(express.json());

// GET /local/test
router.get("/test", (req, res) => {
    res.send("Hello World!");
});
//
// // log the user in using local passport strategy
// app.post("/login", (req, res, next) => {
//     // authenticate the user using our local passport strategy
//     passport.authenticate("local", (err, user, info) => {
//         if (err) {
//             res.send(err);
//         }
//         // if authentication failed
//         if (!user) {
//             res.status(400).send("Your email or password is incorrect.");
//         }
//         // if authentication was successful
//         else {
//             req.login(user, (err) => {
//                 if (err) {
//                     throw err;
//                 }
//                 // if no errors, log in is successful, send user details to client
//                 console.log("You have been authenticated! Hello there!");
//                 res.status(200).send({
//                     id: req.user.id,
//                     firstName: req.user.firstName,
//                     lastName: req.user.lastName,
//                     email: req.user.email,
//                     confirmedEmail: req.user.confirmedEmail,
//                 });
//             });
//         }
//     })(req, res, next);
// });
//
// /register is an HTTP POST method. Client POSTS register form data to backend to be created as a user.
// accepts form inputs from frontend register page
router.post("/register", async (req, res) => {
    try {
        // check if a user with the given email already exists
        const user = await User.findOne({ email: req.body.email });

        // if user already exists, don't register
        if (user) {
            res.status(400).send("A user already exists with that email");
        } else {
            // if user doesn't exist, register a new user
            const { displayName, email, password, confirmPassword } = req.body;
            // encrypt the password the user gives, so it is not stored as plaintext in the DB
            const hashedPassword = await bcrypt.hash(password, 10);
            // if passwords in the register form match and there is no existing email in the DB, create a new user
            if (password === confirmPassword) {
                const newUser = new User({
                    displayName: displayName,
                    email: email,
                    password: hashedPassword
                });
                // get details (including uuid) of this newly registered user
                const savedNewUser = await newUser.save();
                // send confirmation email with email address and uuid attached
                sendThankYouEmail(savedNewUser.email, savedNewUser.displayName);
                res.status(200).send("Registered successfully");
            } else {
                res.status(400).send("Registration failed due to mismatching passwords");
            }
        }
        // throw new Error("Test Error")
    } catch (err) {
        console.log(err);
        res.status(500).send("An error occurred during registration");
    }
});

//
// // once the button for email confirmation is clicked, update the DB to mark the user's email as confirmed
// // accepts a userid
// // e.g. data = {
// //      'userid': userid
// //    }
// app.post("/confirmEmail", (req, res) => {
//     const userID = req.body.userid;
//     let confirmedEmail = null;
//     console.log("got incoming id:", userID);
//     // if email hasn't been confirmed
//     User.findById(userID, (err, result) => {
//         if (err) {
//             res.status(400).send(err);
//         } else {
//             confirmedEmail = result.confirmedEmail;
//             // only update if email isn't already confirmed
//             if (confirmedEmail === false) {
//                 User.findByIdAndUpdate(
//                     { _id: userID },
//                     { confirmedEmail: true },
//                     (err, result) => {
//                         if (err) {
//                             console.log(err);
//                             res.send(err);
//                         } else {
//                             console.log(result);
//                             res.status(200).send(
//                                 "Email successfully confirmed!",
//                             );
//                         }
//                     },
//                 );
//             }
//             // if it has been confirmed already
//             else {
//                 res.status(400).send("Email already confirmed!");
//             }
//         }
//     });
//     console.log("confirmed email:", confirmedEmail);
// });
//
// // accepts an email
// // e.g. data = {
// //      'email': email
// //   }
// // app.post("/sendResetEmail", (req, res) => {
// //     const email = req.body.email;
// //     // look for an existing user with the email input from the send reset email page
// //     User.find({ email: email }, (err, result) => {
// //         if (err) {
// //             res.status(400).send(err);
// //         } else {
// //             // if user was found
// //             if (result && result.length > 0) {
// //                 // get user ID associated with incoming email address
// //                 const userID = result[0]._id;
// //                 // send a password reset email with their userID as the URL parameter
// //                 sendPasswordResetEmail(email, userID);
// //                 res.status(200).send(
// //                     "An email containing instructions on how to reset your password has been sent.",
// //                 );
// //             } else {
// //                 // if no user was found
// //                 res.status(400).send(
// //                     "No account was found linked to that email.",
// //                 );
// //             }
// //         }
// //     });
// // });
//
// // accepts a userID and a new password
// // e.g. data = {
// //    'userid': userid,
// //    'newPassword': newPassword
// //    }
// app.post("/passwordChange", async (req, res) => {
//     const userID = req.body.userid;
//     // hash and salt new password with bcrypt
//     const newPasswordHashed = await bcrypt.hash(req.body.newPassword, 10);
//     // find user associated with userid, update password
//     User.findOneAndUpdate(
//         { _id: userID },
//         { $set: { password: newPasswordHashed } },
//         (err, result) => {
//             if (err) {
//                 console.log("An error occurred.");
//                 res.status(400).send(err);
//             } else {
//                 // if user found
//                 if (result) {
//                     res.status(200).send("Password successfully updated!");
//                 }
//                 // no user could be found with the given req userID
//                 else {
//                     res.status(400).send("Invalid userID provided.");
//                 }
//             }
//         },
//     );
// });
//
// // return logged-in user data
// app.get("/getUser", (req, res) => {
//     res.send(req.user);
// });
//
// // log the user out (end the express session)
// app.get("/logout", (req, res) => {
//     req.logout(req.user);
//     res.status(200).send("You have successfully logged out!");
// });
//
module.exports = router;
