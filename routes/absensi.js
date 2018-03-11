const express = require('express');
const router = express.Router();
const config = require('../config/database');
const Matkul = require('../models/matkul');
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
  Matkul.getPresentMatkul(labdasar, {_id: req.params.id, hari: presentDate.getDay()}, (err, matkul) => {
    if(err) throw err;
    if(!matkul){
      return res.json({success: false, msg: 'Tidak ada mata kuliah'});
    }
    let waktuMatkul = {
      mulai: matkul.jam_mulai.split(':'),
      selesai : matkul.jam_selesai.split(':')
    };
    let presentTime = {
      mulai: convertTime(presentDate,waktuMatkul.mulai),
      selesai: convertTime(presentDate, waktuMatkul.selesai)
    };

    let listAsisten = new Array();    
    for(let i = 0; i < matkul.asisten.length; i++){
      let element = matkul.asisten[i];
      Absensi.getStatus(element, matkul._id, presentTime, (err, absensi) => {
        if(!absensi){
          listAsisten.push({nim: element, hadir: false});
        } else {
          listAsisten.push({nim: element, hadir: true});
        }
        if(i == matkul.asisten.length - 1){
          res.json({success: true, data: listAsisten});
        }
      });
    }    
  });
});

// Absen Ngawas
router.post('/:id', (req, res, next) => {
  let presentDate = new Date();
  Matkul.getMatkulById(req.params.id, (err, matkul) => {
    if(err) throw err;
    if(!matkul){
      return res.json({success: false, msg: 'Tidak ada mata kuliah'});
    }
    let mulai = matkul.jam_mulai.split(':');
    let selesai = matkul.jam_selesai.split(':');
    let menitMatkul = {
      mulai: (mulai[0]*60)+parseInt(mulai[1]),
      selesai: (selesai[0]*60)+parseInt(selesai[1])
    };
    let menitPresent = (presentDate.getHours()*60)+presentDate.getMinutes();
    if (menitMatkul.mulai <= menitPresent && menitMatkul.selesai >= menitPresent){
      let newAbsensi = new Absensi({
        id_matkul: matkul._id,
        nim: req.body.nim,
        hadir: req.body.hadir,
        waktu: presentDate.getTime()
      });
      Absensi.setAbsensi(newAbsensi, (err, matkul) => {
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

module.exports = router;
