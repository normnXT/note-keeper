const express = require('express');
const Note = require('../models/Note');

const router = express.Router();

// ***DEV NOTES***
// work out error messages once front-end is further along
//


// GET /notes/test
router.get('/test', (req, res) => {
    res.send('Hello World!');
});

// GET /notes will get all notes
router.get('/', async (req, res) => {
    try {
        const notes = await Note.find();
        res.status(200).json(notes);
    } catch (err) {
        console.error(err);
        res.status(404).json({ error: "No notes found" });
    }
});

// POST /notes will create a note
router.post('/', async (req, res) => {
    try {
        const newNote = new Note({
            title: req.body.title,
            entry: req.body.entry
            });

        const newNoteRes = await newNote.save()
        res.status(201).json(newNoteRes)
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create note" });
    }
});


// GET /notes/:id will get a single note
router.get('/:id', async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        res.status(200).json(note);
    } catch (err) {
        console.error(err);
        res.status(404).json({ error: "No note found" });
    }
});

// PATCH /notes/:id will update a single note
router.patch('/:id', async (req, res) => {
    try {
        const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json(updatedNote);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update note" });
    }
});

// DELETE /notes/:id will delete a single note
router.delete('/:id', async (req, res) => {
    try {
        const deletedNote = await Note.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedNote);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete note" });
    }
});

module.exports = router;