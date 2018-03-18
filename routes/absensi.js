const express = require('express');
const router = express.Router();
const config = require('../config/database');
const Kelas = require('../models/kelas');
const Absensi = require('../models/absensi');
const labdasar = require('../config/lab');

function convertTime(now, data){
  now.setHours(data[0]);
  now.setMinutes(data[1]);
  return now.getTime();
};

// Get Asisten
router.get('/:id', (req, res, next) => {
  let presentDate = new Date();
  let presentTime = presentDate.getHours()*60 + presentDate.getMinutes();
  Kelas.getPresentKelas(labdasar, {_id: req.params.id, hari: presentDate.getDay(), jam_mulai: {$lt : presentTime}, jam_selesai: {$gt : presentTime}}, (err, Kelas) => {
    if(err) throw err;
    if(!Kelas){
      return res.json({success: false, msg: 'Tidak ada mata kuliah'});
    }

    let listAsisten = new Array();    
    for(let i = 0; i < Kelas.asisten.length; i++){
      let element = Kelas.asisten[i];
      Absensi.getStatus(element, Kelas._id, presentTime, (err, absensi) => {
        if(!absensi){
          listAsisten.push({nim: element, hadir: false});
        } else {
          listAsisten.push({nim: element, hadir: true});
        }
        if(i == Kelas.asisten.length - 1){
          res.json({success: true, data: listAsisten});
        }
      });
    }    
  });
});

// Absen Ngawas
router.post('/:id', (req, res, next) => {
  let presentDate = new Date();
  let presentTime = presentDate.getHours()*60 + presentDate.getMinutes();
  Kelas.getKelasById(req.params.id, (err, kelas) => {
    if(err) throw err;
    if(!kelas){
      return res.json({success: false, msg: 'Tidak ada mata kuliah'});
    }
    if (kelas.jam_mulai <= presentTime && kelas.jam_selesai >= presentTime){
      let newAbsensi = new Absensi({
        id_matkul: kelas._id,
        nim: req.body.nim,
        hadir: req.body.hadir,
        waktu: presentDate.getTime()
      });

      Absensi.setAbsensi(newAbsensi, (err, kelas) => {
        if(err){
          res.json({success: false, msg: "Absen gagal"});
        } else {
          res.json({success: true, msg: "Absen berhasil"});
        }
      });
    } else {
      res.json({success: false, msg: "Timeout, refresh halaman."});
    }
  });
});

//Edit Absensi
router.post('/edit/:id', (req, res, next) => {
  let presentDate = new Date();
  let presentTime = presentDate.getHours()*60 + presentDate.getMinutes();
  Absensi.editAbsensi(req.params.id, req.params.body, (err, kelas) => {
    if(err){
      res.json({success: false, msg: "Perubahan gagal"});
    } else {
      res.json({success: true, msg: "Perubahan berhasil"});
    }
  });
});

module.exports = router;
