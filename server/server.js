const dotenv = require("dotenv");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;
const AuthStrategy = require("passport-google-oauth2").Strategy;

const adminRouter = require("./routes/admin");
const localRouter = require("./routes/local");
const noteRouter = require("./routes/notes");
const authRouter = require("./routes/auth");
const mongo_uri = require("./config/keys").mongoProdURI;
const User = require("./models/User");

// Loads .env into process.env
dotenv.config();

app.use(express.json());

// Sets up express session to store user session data server side
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24, // 1 day
        },
    }),
);

app.use(cookieParser(process.env.COOKIE_SECRET));

// Initializes passport session and sets passport strategy
app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new AuthStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/auth/google/callback",
            scope: ["profile", "email"],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({
                    email: profile.emails[0].value,
                });

                if (!user) {
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

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
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
app.use("/admin", adminRouter);
app.use("/notes", noteRouter);
app.use("/auth", authRouter);
app.use("/local", localRouter);

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
    .connect(mongo_uri)
    .then(() => console.log(`Mongodb Connected`))
    .catch((error) => console.log(error));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
