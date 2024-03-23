const mongoose = require('mongoose');
// const bodyParse = require('body-parser');
const app = require('express')();

// DB connection
const db = require('./config/keys').mongoProdURI;
mongoose
    .connect(db)
    .then(() => console.log(`Mongodb Connected`))
    .catch(error => console.log(error));

const ClientRouter = require('./routes/client');
app.use('/', ClientRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});