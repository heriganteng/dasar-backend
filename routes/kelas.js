const express = require('express');
const router = express.Router();
const config = require('../config/database');
const Kelas = require('../models/kelas');
const KelasMember = require('../models/kelas-member');
const labdasar = require('../config/lab');
const Mahasiswa = require('../models/mahasiswa');

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

// Show member of the class
router.post('/member', (req, res, next) => {
  KelasMember.getMembers({kode_matkul: req.body.kode_matkul, kelas: req.body.kelas}, (err, members) => {
    if(err) throw err;
    if(members.length > 0){
      res.json({success: true, data: members});
    } else {
      return res.json({success: false, msg: 'Tidak ada mahasiswa di kelas ini'});
    }
  });
});

// Join a class
router.post('/join', (req, res, next) => {
  let criteria = {
    kode_matkul: req.body.kode_matkul,
    kelas: req.body.kelas,
    nim: req.body.nim
  };
  KelasMember.getMembers(criteria, (err, member) => {
    if(err) throw err;    
    if(member.length > 0){
      return res.json({success: false, msg: 'Mahasiswa sudah terdaftar di kelas ini'});
    } else {
      let newMember = new KelasMember(criteria);
      console.log(newMember);
      
      KelasMember.joinKelas(newMember, (err, member) => {
        if(err){
          res.json({success: false, msg: "Gagal mendaftarkan mahasiswa ke dalam kelas"});
        } else {
          res.json({success: true, msg: "Berhasil mendaftarkan mahasiswa ke dalam kelas"});
        }
      });
    }
  });
});

module.exports = router;
