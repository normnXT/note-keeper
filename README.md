## Quick overview

This is a React application that is served by an Express/Node backend and Mongo database, also known as the MERN stack, for the purpose of note-keeping. Basic CRUD operations can be performed on a notes database using the UI and a rich HTML WYSIWYG text editor provided by TinyMCE. The application contains one of many possible solutions for creating a desktop/mobile responsive multi-row or grid carousel using the SwiperJS library, which carousel libraries like Swiper do not natively support. Users have the option of logging into an account either locally with a registered email/password combination or by using Google OAuth 2.0. 

I created this project to familiarize myself with Javascript and full-stack web development. Due to the purpose of the project being learning, AI and tutorials were not used to produce any code. An enormous amount was learned about JS, MERN, and full-stack web development through research, documents and iteration! 

Click the image below to be directed to YouTube to watch a quick, unedited, informal preview of the app and Swiper grid functionality without needing to log in or create notes:

[![Screenshot 2024-08-20 111630](https://github.com/user-attachments/assets/81b26af6-25e4-43ab-bf0c-ce0bd96fa042)](http://www.youtube.com/watch?v=9KhtDzO0XJ4 "Preview")

## List of tech features

* MERN Stack: The project is developed using the MERN stack, which includes:

   * React for the frontend: https://react.dev/reference/react
   * Express framework for building the API: https://expressjs.com/en/4x/api.html
   * Node.js as the server's runtime environment: https://nodejs.org/en/docs
   * MongoDB for the database: https://www.mongodb.com/docs/

* The application uses TinyMCE for rich WYSIWYG text editing, enabling users to create and edit notes in a modern editor.
Reference: https://www.tiny.cloud/docs/

* A custom solution is implemented to create a multi-row or grid carousel using SwiperJS, allowing for responsive layouts on both desktop and mobile devices.
Reference: https://swiperjs.com/react

* The application supports user authentication through Google OAuth 2.0, in addition to traditional email/password login.
Reference: https://developers.google.com/identity/protocols/oauth2

* Docker is used as the development environment, with live reloading enabled.
Reference: https://docs.docker.com/

* User sessions are handled using Express sessions, ensuring a more secure and persistent authentication versus the popular alternative of JWTs.
Reference: https://expressjs.com/en/resources/middleware/session.html

* Nodemailer is used as a service for sending emails over SMTP.
Reference: https://nodemailer.com/about/

## OAuth and other architecture

![image](https://github.com/user-attachments/assets/c4c56487-a7a4-4af8-840d-95061ac744c5)

The web application uses a simple three tier client-server architecture. The user interacts with a React client and user actions will prompt the client to send requests to the Node.js server, using functions like this `onClick` function that is used to delete notes:

```javascript
const onDelete = async (id) => {
        try {
            const res = await axios.delete(`/api/notes/${id}`);
            if (res.status === 200) {
                const updatedNotes = context.notes.filter(
                    (note) => note._id !== id,
                );
                context.setNotes(updatedNotes);
                toast.success("Note deleted successfully");
            }
        } catch (err) {
            console.error(err);
            const errorMessage =
                err.response?.data?.error || "An error occurred";
            toast.error(errorMessage);
        }
    };
```

When the function is called, the server will route the request using a router function:

```javascript
router.delete("/:id", async (req, res) => {
    try {
        const deletedNote = await Note.findByIdAndDelete(req.params.id);
        res.status(200).send(deletedNote._id);
    } catch (err) {
        console.error(err);
        res.status(404).json({ error: "Failed to delete note" });
    }
});
```

The ID parameter, passed by the client in the URL, is used by the server router to access and delete the note in the Mongo database. The server will provide the client with the deleted notes ID if successful, or it will notify the client that the deletion operation failed. HTTP status codes are also provided to the client in response.

![image](https://github.com/user-attachments/assets/f030c619-f9c8-4d43-a981-c2d795f11f67)

The Google OAuth 2.0 authentication process is handled by the server with help from PassportJS. The PassportJS authentication strategy is specified in the server.js file:

```javascript
passport.use(
    new OAuthStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/api/auth/google/callback",
            proxy: true,
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
```

On the login page in the client, the user has the option to use the "Login with Google" button that will send a GET request to the server when clicked:

```javascript
const onGoogleLogin = () => {
        try {
            window.open(`http://localhost:4000/api/auth/google`, "_self");
        } catch (err) {
            toast.error("An error occurred");
        }
    };
```

As a result of the request, the server will use PassportJS to generate a URL that contains query paramaters like the scope of the information required by the application, and a request token will also be provided to Google:

```javascript
router.get("/google", passport.authenticate("google", ["profile", "email"]));
```

When the URL is called, an authorization code will be provided by Google in response. Following that, the Google callback URL is called:

```javascript
router.get(
    "/google/callback",
    passport.authenticate("google", {
        successRedirect: process.env.CLIENT_URL,
        failureRedirect: "/login/failed",
        prompt: "consent",
        accessType: "offline",
    }),
    (req, res) => {
        console.log("Session after callback:", req.session);
        console.log("User after callback:", req.user);
        res.redirect(process.env.CLIENT_URL);
    },
);
```

The callback exchanges the authorization code for access and refresh tokens to access the Google API on the users behalf, and the users information. The user's information is saved to the Mongo database as seen in the function that receives the tokens and user information in the PassportJS strategy, and a unique ObjectID is generated that can be used to identify the user and the user's information in the database. If successful it redirects the user from the Google consent and login screen to the client's homepage, and they will be logged in. The user's ObjectID is serialized and stored in the user's session:

```javascript
passport.serializeUser((user, done) => {
    console.log('serializing')
    done(null, user.id);
});
```

While they are logged in, the user's session containing their ObjectID can be deserialized (which occurs on each subsequent API request) to access their information in the Mongo database through `req.user`:

```javascript
passport.deserializeUser((id, done) => {
    console.log('deserializing')
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
```

## Developing and forking/cloning the project

*Disclaimer: The "Developing and forking/cloning the project" section of this README was generated by AI based on a set of instructions but has been extensively revised and verified for correctness.*

This project uses Docker as a development environment. The docker-compose.yaml file sets up three services: client, server, and notes-database. Live reloading is enabled on both the client and server. For the client, `WATCHPACK_POLLING` is set to enable live reloading, and the server uses `CHOKIDAR_USEPOLLING` and `nodemon` for the same purpose. This setup allows you to make changes to your code in both the server and client and see them reflected immediately without needing to rebuild the Docker containers. 

Follow these steps to set up a development environment for this project:

1. **Environment variables**
   
   Create a file named `.env.dev` in `/server/config` with the following variables:

   ```
   CLIENT_URL=http://localhost:3000/
   SERVER_URL=http://localhost:4000
   EMAIL=your-gmail@gmail.com
   APP_PASSWORD=your-gmail-app-password
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   MONGO_URI=mongodb://notes-database:27017/notesdb
   SESSION_SECRET=your-session-secret
   ```

   Replace the placeholders with your actual data. These variables are loaded into the servers `process.env` using the `dotenv` library with this line of code in the `server.js` file:

   ```javascript
   dotenv.config({ path: "./config/.env.dev" });
   ```

2. **Google OAuth 2.0 setup**
   
   - Go to the [Google Cloud Console](https://console.cloud.google.com/).
   - Create a new project or select an existing one.
   - Create OAuth 2.0 credentials (Web application type).
   - Set the authorized redirect URIs to:
     - `http://localhost:4000/api/auth/google/callback`
     - `http://localhost:3000/`
   - Add your login email to the list of test users.
   - Copy the Client ID and Client Secret to your `.env.dev` file.

3. **Gmail setup for nodemailer**
   
   The mailer is used to send password reset emails and account creation "welcome" emails. It's recommended to create a new Gmail account for the SMTP mailer in its current state, as app passwords are less secure than modern 2-step verification.
   - Use the created Gmail account address for the `EMAIL` variable in `.env.dev`.
   - Generate an App Password for this Gmail account:
     - Go to your Google Account settings.
     - Navigate to Security > 2-Step Verification > App passwords.
     - Create a new app password and copy it to the `APP_PASSWORD` variable in `.env.dev`.
   

4. **Database setup**
   
   You have two options for setting up the database:

   a. Local MongoDB using Docker:
      - The docker-compose.yaml file is already configured to support a local Mongo database.
      - The database uses the MongoDB 6.0 image and a Docker volume is created to persist data between sessions.
      - Use the provided MongoDB URI to connect the server and database: `mongodb://notes-database:27017/notesdb`.

   b. MongoDB Atlas or similar services:
      - [Create a free cluster in MongoDB Atlas.](https://www.mongodb.com/docs/atlas/tutorial/deploy-free-tier-cluster/)
      - Obtain the connection URI from Atlas and ensure it contains your credentials.
      - Replace the `MONGO_URI` in your `.env.dev` with the Atlas URI.

5. **Add your session secret**
    
   Use a [password generator](https://www.lastpass.com/features/password-generator) to create your `SESSION_SECRET`, and add it to `.env.dev`.

6. **Client proxy**
    
   In `client/package.json`, ensure the proxy is set to:
   ```json
   "proxy": "http://host.docker.internal:4000"
   ```

7. **Build and Run**
    
   In the project root directory, run:
   ```
   docker-compose up --build
   ```
   This command will build and start the client, server, and database containers.

8. **Optional: Populate a user's account with notes for development**
   
   A data seeder has been provided in the `/server/utils` directory, it will insert notes into a users account to more easily test the Swiper carousel and application.

   - Create a user account in the application or log in with Google.
   - Find the ObjectId of the created user in the database.
   - Use Postman or a similar API client to send a POST request to `http://localhost:4000/api/seed/:id`, where `:id` is the user's `ObjectId`. For example,
     `http://localhost:4000/api/seed/60a12345b678c9abcdef1234`.
     
   This will create 14 sample HTML notes in the specified user's account.

Your development environment should now be set up and running. The client will be available at `http://localhost:3000`, and the server at `http://localhost:4000`.


## Production and deployment

The client is hosted on Netlify at `https://notekeeper.xyz/` or `https://www.notekeeper.xyz/`, and the server is hosted on Heroku at `https://api.notekeeper.xyz/`. The services both provide an API to enter and store environment variables, and no `.env` file is required. SSL certificates are handled by Heroku's Automated Certificate Management (ACM) service. Docker is used in development only.   

## Significant roadblocks during development and their solutions
