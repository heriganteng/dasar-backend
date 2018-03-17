const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const config = require('../config/database');
const Materi = require('../models/materi');

// Store for Materi
const store = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/materi');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '.' + file.originalname);
  }
});

// Store for File Upload dari Praktikan
const store_praktikan = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/praktikan');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '.' + file.originalname);
  }
});

const upload = multer({ storage: store }).single('file');
const upload_praktikan = multer({ storage: store_praktikan }).single('file');

// Materi
router.post('/upload-materi', function(req, res, next) {
  upload(req, res, function(err) {
    console.log(req.body);

    if (err) {
      return res.status(501).json({ error: err });
      console.log(err);
    }
    //do all database record saving activity
    let newMateri = new Materi({
      nama_lama: req.file.originalname,
      nama_baru: req.file.filename,
      id_matkul: req.body.id_matkul
    });
    Materi.addMateri(newMateri, (err, user) => {
      if (err) {
        console.log(err);
        return res.json({ success: false, msg: 'Gagal Upload Materi' });
      } else {
        console.log('Berhasil');

        return res.json({
          originalname: req.file.originalname,
          uploadname: req.file.filename
        });
      }
    });
  });
});

// File dari Praktikan
router.post('/upload-file', function(req, res, next) {
  upload_praktikan(req, res, function(err) {
    console.log(req.body);

    if (err) {
      return res.status(501).json({ error: err });
      console.log(err);
    }
    //do all database record saving activity
    let newUploadPraktikan = new FilePraktikan({
      nama_lama: req.file.originalname,
      nama_baru: req.file.filename,
      id_matkul: req.body.id_matkul
    });
    Materi.addMateri(newMateri, (err, user) => {
      if (err) {
        console.log(err);
        return res.json({ success: false, msg: 'Gagal Upload Materi' });
      } else {
        console.log('Berhasil');

        return res.json({
          originalname: req.file.originalname,
          uploadname: req.file.filename
        });
      }
    });
  });
});

router.post('/download', function(req, res, next) {
  filepath =
    path.join(__dirname, '../uploads/materi') + '/' + req.body.filename;
  res.sendFile(filepath);
});

module.exports = router;
