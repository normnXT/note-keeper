const express = require('express');
const Note = require('../models/Note');

const router = express.Router();

// DEV NOTES
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
        res.json(notes).status(200);
    } catch (err) {
        console.error(err);
        res.status(404).json({ error: "No notes found" });
    }
});

// GET /notes/:id will get a single note
router.get('/:id', async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        res.json(note).status(200);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "No note found" });
    }
});

// PUT notes/:id will update a single note
router.patch('/:id', async (req, res) => {
    try {
        await Note.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update note" });
    }
});

//

router.post('/:id', async (req, res) => {
    try {
        await Note.findByIdAndDelete(req.params.id, req.body);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete note" });
    }
});


module.exports = router;