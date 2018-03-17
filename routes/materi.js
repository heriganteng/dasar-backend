const express = require('express');
const router = express.Router();
const config = require('../config/database');
const Materi = require('../models/materi');

// Show All Materi
router.get('/show', (req, res, next) => {
  Materi.find((err, materi) => {
    // Note that this error doesn't mean nothing was found,
    // it means the database had an error while searching, hence the 500 status
    if (err) return res.status(500).send(err);
    // send the list of all people
    return res.status(200).send(materi);
  });
});

// Show Materi per matkul
router.post('/tampil', (req, res, next) => {
  let id_matkul = req.body.id_matkul;

  Materi.getMateriByIdMatkul(id_matkul, (err, data) => {
    if (err) return res.status(500).send(err);
    // send the list of all materi
    return res.status(200).send(data);
  });
});

module.exports = router;
