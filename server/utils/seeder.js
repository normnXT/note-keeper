const express = require('express');
const Note = require("../models/Note");
const syntheticNotes = require("../data/syntheticNotes");

const router = express.Router();
router.use(express.json());

router.post("/:id", async (req, res) => {
    try {
        const userId = req.params.id;

        // Add user ID to each note
        const notesWithUser = syntheticNotes.map(note => ({
            user: userId,
            ...note,
        }));

        // Insert all synthetic notes
        const insertedNotes = await Note.insertMany(notesWithUser);
        res.status(201).json(insertedNotes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create notes' });
    }
});

module.exports = router;