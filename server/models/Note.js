const mongoose = require("mongoose");

const NotesSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users",
    },
    title: {
        type: String,
        required: true,
    },
    entry: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = Note = mongoose.model("notes", NotesSchema);
