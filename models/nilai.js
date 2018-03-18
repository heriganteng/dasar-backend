const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

// Skema Nilai
const NilaiSchema = mongoose.Schema({
  id_Nilai: {
    type: String,
    required: true
  },
  id_user: {
    type: String,
    required: true
  },
  nilai: {
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

const Nilai = module.exports = mongoose.model('Nilai', NilaiSchema);

module.exports.getNilai = function(lab, callback){
  const query = {labdasar: lab};
  Nilai.find(query, callback);
}

module.exports.getNilaiById = function(id, callback){
  Nilai.findById(id, callback);
}

module.exports.getPresentNilai = function(lab, query, callback){
  query.labdasar = lab;
  Nilai.findOne(query, callback);
}

module.exports.addNilai = function(Nilai, callback){
  Nilai.save(callback);
}