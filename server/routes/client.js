const express = require('express');
const notesModel = require('./../models/notes');

const router = express.Router();

router.get('/', async (req, res) => {
    res.send('Hello World!');
});

module.exports = router;