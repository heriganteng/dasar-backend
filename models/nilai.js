const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

// Skema Nilai
const NilaiSchema = mongoose.Schema({
  id_kelas: {
    type: String,
    required: true
  },
  nim: {
    type: String,
    required: true
  },
  nilai: {
    type: Number,
    required: true
  },
  no_laporan: {
    type: Number,
    required: true
  },
  tanggal: {
    type: Date,
    default: Date.now
  }
});

const Nilai = module.exports = mongoose.model('Nilai', NilaiSchema);

module.exports.getNilai = function(query, callback){
  Nilai.find(query, callback);
}

module.exports.inputNilai = function(Nilai, callback){
  Nilai.save(callback);
}

module.exports.editNilai = function(id, data, callback){
  Nilai.findByIdAndUpdate(id, data, callback);
};