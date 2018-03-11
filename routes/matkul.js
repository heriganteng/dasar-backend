const express = require('express');
const router = express.Router();
const config = require('../config/database');
const Matkul = require('../models/matkul');
const labdasar = require('../config/lab');

// Show All Matkul
router.get('/show', (req, res, next) => {
  Matkul.getMatkul(labdasar, (err, matkul) => {
    if(err) throw err;
    if(matkul.length > 0){
      res.json({success: true, data: matkul});
    } else {
      return res.json({success: false, msg: 'Tidak ada mata kuliah'});
    }
  });
});

// Show Present Matkul
router.get('/now', (req, res, next) => {
  let presentDate = new Date();
  Matkul.getPresentMatkul(labdasar, {hari: presentDate.getDay()}, (err, matkul) => {
    if(err) throw err;
    if(matkul.length > 0){
      let presentMatkul;
      matkul.forEach(element => {
        let mulai = element.jam_mulai.split(':');
        let selesai = element.jam_selesai.split(':');
        let menitMatkul = {
          mulai: (mulai[0]*60)+parseInt(mulai[1]),
          selesai: (selesai[0]*60)+parseInt(selesai[1])
        };
        let menitPresent = (presentDate.getHours()*60)+presentDate.getMinutes();
        if (menitMatkul.mulai <= menitPresent && menitMatkul.selesai >= menitPresent){
          presentMatkul = element;
        }
      });
      if (presentMatkul != null){
        res.json({success: true, data: presentMatkul});
      } else {
        res.json({success: false, msg: 'Tidak ada mata kuliah'});  
      }
    } else {
      return res.json({success: false, msg: 'Tidak ada mata kuliah'});
    }
  });
});

// Input New Matkul
router.post('/input', (req, res, next) => {
  let newMatkul = new Matkul({
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
  Matkul.addMatkul(newMatkul, (err, matkul) => {
    if(err){
      res.json({success: false, msg: "Gagal menambahkan mata kuliah"});
    } else {
      res.json({success: true, msg: "Berhasil menambahkan mata kuliah"});
    }
  });
});

module.exports = router;
