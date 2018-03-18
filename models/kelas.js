const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

// Skema Kelas
const KelasSchema = mongoose.Schema({
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
    type: Number,
    required: true
  },
  jam_selesai: {
    type: Number
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

const Kelas = module.exports = mongoose.model('Kelas', KelasSchema);

module.exports.getKelas = function(lab, callback){
  const query = {labdasar: lab};
  Kelas.find(query, callback);
}

module.exports.findKelas = function(lab, query, callback){
  query.labdasar = lab;
  Kelas.find(query, callback);
}

module.exports.getKelasById = function(id, callback){
  Kelas.findById(id, callback);
}

module.exports.getPresentKelas = function(lab, query, callback){
  query.labdasar = lab;
  Kelas.findOne(query, callback);
}

module.exports.addKelas = function(kelas, callback){
  kelas.save(callback);
}