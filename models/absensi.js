const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

// Skema Absensi
const AbsensiSchema = mongoose.Schema({
  id_matkul: {
    type: String,
    required: true
  },
  nim: {
    type: String,
    required: true
  },
  hadir: {
    type: Boolean,
    required: true,
  },
  waktu: {
    type: Date,
    required: false
  }
});

const Absensi = module.exports = mongoose.model('Absensi', AbsensiSchema);

module.exports.getStatus = function(nim, id_matkul, waktu, callback){
  const query = {nim: nim, id_matkul: id_matkul, waktu: { $gte : waktu.mulai, $lte : waktu.selesai}};
  Absensi.findOne(query, callback);
};

module.exports.setAbsensi = function(absen, callback){
  absen.save(callback);
};

module.exports.editAbsensi = function(id, data, callback){
  Absensi.findByIdAndUpdate(id, data, callback);
};