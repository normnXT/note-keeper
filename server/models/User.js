const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: false,
    },
    displayName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: false,
    },
    image: {
        type: String,
        required: false,
    },
    created_at: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = User = new mongoose.model("users", UsersSchema);
