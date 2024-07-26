## Quick overview

This is a React application for note keeping that is served by a Express/Node backend and Mongo database, also known as the MERN stack. Basic CRUD operations can be performed on a notes database using the UI and a rich WYSIWYG text editor provided by TinyMCE. The application contains one of many possible solutions for creating a desktop/mobile responsive multi-row grid carousel using the SwiperJS library, which carousel libraries like Swiper do not natively support. Users have the option of logging into an account and initiating an express session, either locally with a registered email/password combination, or by using Google OAuth 2.0. 

I created this project to familiarize myself with Javascript and full-stack web development. Due to the purpose of the project being learning, AI and tutorials were not used to produce any code. An enormous amount was learned about JS, MERN, and full-stack web development through research, documentation and iteration!

## List of features

## OAuth and other architecture

## Developing and forking/cloning the project

*Disclaimer: This section was generated by AI based on a set of instructions but has been revised and verified for correctness.*

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
   - Add your login email to the list of test users
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
      - The docker-compose.yaml file is already configured to support a local Mongo database
      - The database uses the MongoDB 6.0 image and a Docker volume is created to persist data between sessions
      - Use the provided MongoDB URI to connect the server and database: `mongodb://notes-database:27017/notesdb`

   b. MongoDB Atlas or similar services:
      - [Create a free cluster in MongoDB Atlas.](https://www.mongodb.com/docs/atlas/tutorial/deploy-free-tier-cluster/)
      - Obtain the connection URI from Atlas and ensure it contains your credentials.
      - Replace the `MONGO_URI` in your `.env.dev` with the Atlas URI.

5. **Client proxy**
    
   In `client/package.json`, ensure the proxy is set to:
   ```json
   "proxy": "http://host.docker.internal:4000"
   ```

6. **Build and Run**
    
   In the project root directory, run:
   ```
   docker-compose up --build
   ```
   This command will build and start the client, server, and database containers.

7. **Optional: Populate a user's account with notes for development**
   
   A data seeder has been provided in the `/server/utils` directory, it will insert notes into a users account to more easily test the Swiper carousel and application.

   - Create a user account in the application or log in with Google.
   - Find the ObjectId of the created user in the database.
   - Use Postman or a similar API client to send a POST request to http://localhost:4000/api/seed/:id, where :id is the user's ObjectId. For example:
     `http://localhost:4000/api/seed/60a12345b678c9abcdef1234`
     
   This will create 14 sample HTML notes in the specified user's account.

Your development environment should now be set up and running. The client will be available at `http://localhost:3000`, and the server at `http://localhost:4000`.


## Production and deployment

## Significant roadblocks during development and their solutions
