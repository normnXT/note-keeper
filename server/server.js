const express = require("express");
const session = require("express-session");

const localRouter = require("./routes/local");
const noteRouter = require("./routes/notes");
const authRouter = require("./routes/auth");
const User = require("./models/User");

const MongoStore = require('connect-mongo')
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;
const OAuthStrategy = require("passport-google-oauth2").Strategy;

const app = express();
app.use(express.json());

// Sets up express session to store user data server side
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false, // Session will only be resaved if it is modified
        saveUninitialized: false, // Sessions will only be saved once initialized
        store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
    }),
);

// Initializes passport session
app.use(passport.initialize());
app.use(passport.session());

// Google passport strategy for OAuth 2.0 login
// https://developers.google.com/identity/protocols/oauth2
passport.use(
    new OAuthStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/api/auth/google/callback',
            scope: ["profile", "email"],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({
                    email: profile.emails[0].value,
                });

                if (user) {
                    user.googleId = profile.id;
                    user.displayName = profile.displayName;
                    user.image = profile.photos[0].value;

                    await user.save()
                } else {
                    const newUser = new User({
                        googleId: profile.id,
                        displayName: profile.displayName,
                        email: profile.emails[0].value,
                        image: profile.photos[0].value,
                    });

                    user = await newUser.save();
                }

                return done(null, user);
            } catch (err) {
                return done(err, null);
            }
        },
    ),
);

// Passport strategy for email/password login combination
// User submitted passwords are compared with stored hashes
passport.use(
    new LocalStrategy(
        { usernameField: "email", passwordField: "password" },
        async (email, password, done) => {
            try {
                const user = await User.findOne({ email: email });

                if (!user) {
                    return done(null, false);
                } else {
                    bcrypt.compare(password, user.password, (err, res) => {
                        if (err) throw err;

                        if (res === true) {
                            return done(null, user);
                        } else {
                            return done(null, false);
                        }
                    });
                }
            } catch (err) {
                console.log(err);
                done(err);
            }
        },
    ),
);

// On user login, stores user ID in the session store
passport.serializeUser((user, done) => {
    console.log("serializing");
    done(null, user.id);
});

// On each subsequent API request, deserializer uses the stored user ID to retrieve user data and store it under req.user
// Only users with a Google profile have a user.image, so it is optional
passport.deserializeUser((id, done) => {
    console.log("deserializing");
    User.findOne({ _id: id })
        .then((user) => {
            if (!user) {
                return done(null, false);
            }

            const userInfo = {
                id: user._id,
                displayName: user.displayName,
                email: user.email,
                image: user.image || null,
            };

            done(null, userInfo);
        })
        .catch((err) => {
            console.log(err);
            done(err);
        });
});

// Route handling to follow /notes, /auth, and /local subdirectories
app.use("/api/notes", noteRouter);
app.use("/api/auth", authRouter);
app.use("/api/local", localRouter);

// Enables cross-origin resource sharing between Google API and client
app.use(
    cors({
        origin: `${process.env.CLIENT_URL}`,
        methods: "GET,POST,PUT,DELETE",
        credentials: true,
    }),
);

// Database connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log(`Mongodb Connected`))
    .catch((error) => console.log(error));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
