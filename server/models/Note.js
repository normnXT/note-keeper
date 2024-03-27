const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotesSchema = new Schema({
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
