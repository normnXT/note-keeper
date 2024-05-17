const express = require("express");

// imports mongoose library and mongoose Note model for database operations
const Note = require("../models/Note");

const router = express.Router();
router.use(express.json());

// GET /notes/test
router.get("/test", (req, res) => {
    res.send("Hello World!");
});

// GET /notes will get all notes
router.get("/", async (req, res) => {
    try {
        const notes = await Note.find();
        res.json(notes).status(200);
    } catch (err) {
        console.error(err);
        res.json({ error: "No notes found" }).status(404);
    }
});

// POST /notes will create a note
router.post("/", async (req, res) => {
    try {
        const newNote = new Note(req.body);
        const newNoteRes = await newNote.save();
        res.json(newNoteRes).status(201);
    } catch (err) {
        console.error(err);
        res.json({ error: "Failed to create note" }).status(500);
    }
});

// GET /notes/:id will get a single note
// router.get("/:id", async (req, res) => {
//     try {
//         const note = await Note.findById(req.params.id);
//         res.json(note).status(200);
//     } catch (err) {
//         console.error(err);
//         res.json({ error: "No note found" }).status(404);
//     }
// });

// PATCH /notes/:id will update a single note
router.patch("/:id", async (req, res) => {
    try {
        const updatedNote = await Note.findByIdAndUpdate(
            req.params.id,
            req.body,
        );
        res.json(updatedNote).status(200);
    } catch (err) {
        console.error(err);
        res.json({ error: "Failed to update note" }).status(500);
    }
});

// DELETE /notes/:id will delete a single note
router.delete("/:id", async (req, res) => {
    try {
        const deletedNote = await Note.findByIdAndDelete(req.params.id);
        res.send(deletedNote._id).status(200);
    } catch (err) {
        console.error(err);
        res.json({ error: "Failed to delete note" }).status(404);
    }
});

module.exports = router;
