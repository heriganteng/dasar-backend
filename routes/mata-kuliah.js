const express = require('express');
const router = express.Router();
const config = require('../config/database');
const MataKuliah = require('../models/mata-kuliah');

// Show All Matkul
router.get('/show', (req, res, next) => {
    MataKuliah.find((err, matkul) => {  
        // Note that this error doesn't mean nothing was found,
        // it means the database had an error while searching, hence the 500 status
        if (err) return res.status(500).send(err)
        // send the list of all people
        return res.status(200).send(matkul);
    });
});

module.exports = router;
