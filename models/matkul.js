const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

// Skema Matkul
const MatkulSchema = mongoose.Schema({
  kode_matkul: {
    type: String,
    required: true
  },
  nama_matkul: {
    type: String,
    required: true
  },
  kelas: {
    type: String,
    required: true
  },
  hari: {
    type: Number,
    required: true
  },
  jam_mulai: {
    type: String,
    required: true
  },
  jam_selesai: {
    type: String
  },
  jumlah_sks: {
    type: Number,
    default: 1,
    required: true
  },
  labdasar: {
    type: Number,
    required: true,
  },
  asisten: {
    type: Array
  }
});

const Matkul = module.exports = mongoose.model('Matkul', MatkulSchema);

module.exports.getMatkul = function(lab, callback){
  const query = {labdasar: lab};
  Matkul.find(query, callback);
}

module.exports.getMatkulById = function(id, callback){
  Matkul.findById(id, callback);
}

module.exports.getPresentMatkul = function(lab, query, callback){
  query.labdasar = lab;
  Matkul.findOne(query, callback);
}

module.exports.addMatkul = function(matkul, callback){
  matkul.save(callback);
}