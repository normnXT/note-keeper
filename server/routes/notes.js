const express = require("express");
const Note = require("../models/Note");

const router = express.Router();
router.use(express.json());

// GET /notes/test
router.get("/test", (req, res) => {
    res.send("Hello World!");
});

// GET /notes gets all notes stored under a specific user ID
router.get("/", async (req, res) => {
    if (!req.user) {
        return res.status(401).send("User not authenticated");
    } else {
        try {
            const notes = await Note.find({ user: req.user.id });
            res.status(200).json(notes);
        } catch (err) {
            console.error(err);
            res.status(404).send("No notes found");
        }
    }
});

// POST /notes will create a note
router.post("/", async (req, res) => {
    try {
        const newNote = new Note({
            user: req.user.id,
            ...req.body,
        });
        const newNoteRes = await newNote.save();
        res.status(201).json(newNoteRes);
        // throw new Error('Test error');
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to create note");
    }
});

// // GET /notes/:id will get a single note
// router.get("/:id", async (req, res) => {
//     try {
//         const note = await Note.findById(req.params.id);
//         res.json(note).status(200);
//     } catch (err) {
//         console.error(err);
//         res.json({ error: "No note found" }).status(404);
//     }
// });

// PATCH /notes/:id updates a single note with the edits made by users
router.patch("/:id", async (req, res) => {
    try {
        const updatedNote = await Note.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true },
        );
        res.status(200).json(updatedNote);
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to update note");
    }
});

// DELETE /notes/:id will delete a single note selected by users
router.delete("/:id", async (req, res) => {
    try {
        const deletedNote = await Note.findByIdAndDelete(req.params.id);
        res.status(200).send(deletedNote._id);
    } catch (err) {
        console.error(err);
        res.status(404).send("Failed to delete note");
    }
});

module.exports = router;
