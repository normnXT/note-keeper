const mongoose = require("mongoose");
const app = require("express")();
const cors = require('cors')
const router = require("./routes/notes");
const uri = require("./config/keys").mongoProdURI;

// Route handling to follow /notes subdirectory
app.use("/notes", router);

// Enables cross-origin resource sharing between Google API and client
app.use(cors({
    origin:"http://localhost:3000",
    methods:"GET,POST,PUT,DELETE",
    credentials:true
}));

// Database connection
mongoose
    .connect(uri)
    .then(() => console.log(`Mongodb Connected`))
    .catch((error) => console.log(error));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
