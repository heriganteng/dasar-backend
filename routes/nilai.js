const express = require('express');
const router = express.Router();
const config = require('../config/database');
const Nilai = require('../models/nilai');
const labdasar = require('../config/lab');

// Show All Nilai
router.get('/:id_kelas', (req, res, next) => {
  Nilai.getNilai({id_kelas: req.params.id_kelas}, (err, nilai) => {
    if(err) throw err;
    if(nilai.length > 0){
      res.json({success: true, data: nilai});
    } else {
      return res.json({success: false, msg: 'Nilai belum ada'});
    }
  });
});

// Edit nilai
router.post('/edit', (req, res, next) => {
  Nilai.editNilai(req.body.id, {nilai: req.body.nilai, tanggal: Date.now()}, (err, nilai) => {
    if(err){
      res.json({success: false, msg: "Perubahan gagal"});
    } else {
      res.json({success: true, msg: "Perubahan berhasil"});
    }
  });
});

// Input Nilai
router.post('/:id_kelas', (req, res, next) => {
  Nilai.getNilai({id_kelas: req.params.id_kelas, nim: req.body.nim, no_laporan: req.body.no_laporan}, (err, nilai) => {
    if(err) throw err;
    if(nilai.length > 0){
      res.json({success: false, msg: 'Nilai sudah pernah diinput'});
    } else {
      let newNilai = new Nilai({
        id_kelas: req.params.id_kelas,
        nim: req.body.nim,
        nilai: req.body.nilai,
        no_laporan: req.body.no_laporan
      });
      Nilai.inputNilai(newNilai, (err, nilai) => {
        if(err)
          res.json({success: false, msg: 'Nilai gagal diinput'});
        else 
          res.json({success: true, msg: 'Nilai berhasil diinput'});
      });
    }
  });
});

module.exports = router;