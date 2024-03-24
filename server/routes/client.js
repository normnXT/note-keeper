const express = require('express');
const bodyParser = require('body-parser')
const notesModel = require('./../models/notes');

const router = express.Router();

// middle-ware for parsing JSON and URL-encoded objects from user input before handling
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

router.get('/', async (req, res) => {
    res.send('Hello World!');
});

module.exports = router;