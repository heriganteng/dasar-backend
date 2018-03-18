const express = require('express');
const router = express.Router();
const config = require('../config/database');
const Kelas = require('../models/kelas');
const labdasar = require('../config/lab');

// Show All Kelas
router.get('/show', (req, res, next) => {
  Kelas.getKelas(labdasar, (err, kelas) => {
    if(err) throw err;
    if(kelas.length > 0){
      res.json({success: true, data: kelas});
    } else {
      return res.json({success: false, msg: 'Tidak ada mata kuliah'});
    }
  });
});

// Find Kelas
router.post('/find', (req, res, next) => {
  Kelas.findKelas(labdasar, req.body, (err, kelas) => {
    if(err) throw err;    
    if(kelas.length > 0){
      if(req.body.kelas != undefined)
        res.json({success: true, data: kelas[0]});
      else
        res.json({success: true, data: kelas});
    } else {
      return res.json({success: false, msg: 'Tidak ada mata kuliah'});
    }
  });
});

// Show Present Kelas
router.get('/now', (req, res, next) => {
  let presentDate = new Date();
  let presentTime = presentDate.getHours()*60 + presentDate.getMinutes();
  Kelas.getPresentKelas(labdasar, {hari: presentDate.getDay(), jam_mulai: {$lt : presentTime}, jam_selesai: {$gt : presentTime}}, (err, Kelas) => {
    if(err) throw err;
    if(Kelas != null){
      res.json({success: true, data: Kelas});
    } else {
      res.json({success: false, msg: 'Tidak ada mata kuliah'});  
    }
  });
});

// Input New Kelas
router.post('/input', (req, res, next) => {
  let newKelas = new Kelas({
    kode_matkul: req.body.kode_matkul,
    nama_matkul: req.body.nama_matkul,
    kelas: req.body.kelas,
    hari: req.body.hari,
    jam_mulai: req.body.jam_mulai,
    jam_selesai: req.body.jam_selesai,
    jumlah_sks: req.body.jumlah_sks,
    labdasar: labdasar,
    asisten: req.body.asisten
  });
  Kelas.addKelas(newKelas, (err, Kelas) => {
    if(err){
      res.json({success: false, msg: "Gagal menambahkan mata kuliah"});
    } else {
      res.json({success: true, msg: "Berhasil menambahkan mata kuliah"});
    }
  });
});

module.exports = router;
