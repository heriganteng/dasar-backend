const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/mahasiswa');

// Register
router.post('/register', (req, res, next) => {
  let newUser = new User({
    name: req.body.name,
    nim: req.body.nim,
    password: req.body.password
  });
  User.getUserByNim(newUser.nim, (err, user) => {
    if(err) throw err;
    if(user){
      return res.json({success: false, msg: 'Mahasiswa sudah terdaftar'});
    } else {
      User.addUser(newUser, (err, user) => {
        if(err){
          res.json({success: false, msg:'Gagal mendaftarkan mahasiswa'});
        } else {
          res.json({success: true, msg:'Mahasiswa berhasil didaftarkan'});
        }
      });
    }
  });
});

// Authenticate
router.post('/authenticate', (req, res, next) => {
  const nim = req.body.nim;
  const password = req.body.password;

  User.getUserByNim(nim, (err, user) => {
    if(err) throw err;
    if(!user){
      return res.json({success: false, msg: 'Mahasiswa tidak ditemukan'});
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if(err) throw err;
      if(isMatch){
        const token = jwt.sign({data: user}, config.secret, {
          expiresIn: 604800 // 1 week
        });

        res.json({
          success: true,
          token: `Bearer ${token}`,
          user: {
            id: user._id,
            name: user.name,
            nim: user.nim,
            admin: user.admin
          }
        });
      } else {
        return res.json({success: false, msg: 'Password salah'});
      }
    });
  });
});

// Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  res.json({user: req.user});
});

module.exports = router;