const express = require("express");
const Note = require("../models/Note");
const syntheticNotes = require("../data/syntheticNotes");

const router = express.Router();
router.use(express.json());

router.post("/", async (req, res) => {
    try {
        // Adding user ID to each note (assuming req.user.id exists and holds the user ID)
        const notesWithUser = syntheticNotes.map(note => ({
            user: "66916d64782702fce2b4df55",
            ...note,
        }));

        // Insert all notes at once
        const insertedNotes = await Note.insertMany(notesWithUser);
        res.status(201).json(insertedNotes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create notes' });
    }
});

module.exports = router;