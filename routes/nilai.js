const express = require('express');
const router = express.Router();
const config = require('../config/database');
const Nilai = require('../models/nilai');
const labdasar = require('../config/lab');

// Show All Nilai
router.get('/show', (req, res, next) => {
  Nilai.getNilai(labdasar, (err, Nilai) => {
    if(err) throw err;
    if(Nilai.length > 0){
      res.json({success: true, data: Nilai});
    } else {
      return res.json({success: false, msg: 'Tidak ada mata kuliah'});
    }
  });
});

// Show Present Nilai
router.get('/now', (req, res, next) => {
  let presentDate = new Date();
  let presentTime = presentDate.getHours()*60 + presentDate.getMinutes();
  Nilai.getPresentNilai(labdasar, {hari: presentDate.getDay(), jam_mulai: {$lt : presentTime}, jam_selesai: {$gt : presentTime}}, (err, Nilai) => {
    if(err) throw err;
    if(Nilai != null){
      res.json({success: true, data: Nilai});
    } else {
      res.json({success: false, msg: 'Tidak ada mata kuliah'});  
    }
  });
});

// Input New Nilai
router.post('/input', (req, res, next) => {
  let newNilai = new Nilai({
    kode_Nilai: req.body.kode_Nilai,
    nama_Nilai: req.body.nama_Nilai,
    kelas: req.body.kelas,
    hari: req.body.hari,
    jam_mulai: req.body.jam_mulai,
    jam_selesai: req.body.jam_selesai,
    jumlah_sks: req.body.jumlah_sks,
    labdasar: labdasar,
    asisten: req.body.asisten
  });
  Nilai.addNilai(newNilai, (err, Nilai) => {
    if(err){
      res.json({success: false, msg: "Gagal menambahkan mata kuliah"});
    } else {
      res.json({success: true, msg: "Berhasil menambahkan mata kuliah"});
    }
  });
});

module.exports = router;
