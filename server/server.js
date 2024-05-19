const dotenv = require("dotenv");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;

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
    }),
);

// Initializes passport session and sets passport strategy
app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new OAuth2Strategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/auth/google/callback",
            scope: ["profile", "email"],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ googleId: profile.id });

                if (!user) {
                    user = new User({
                        googleId: profile.id,
                        displayName: profile.displayName,
                        email: profile.emails[0].value,
                        image: profile.photos[0].value,
                    });

                    await user.save();
                }

                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        },
    ),
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Route handling to follow /notes and /auth subdirectories
app.use("/notes", noteRouter);
app.use("/auth", authRouter);

// Enables cross-origin resource sharing between Google API and client
app.use(
    cors({
        origin: "http://localhost:3000",
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
