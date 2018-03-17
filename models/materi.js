const mongoose = require('mongoose');
const config = require('../config/database');

// Skema Matkul
const MateriSchema = mongoose.Schema({
  nama_lama: {
    type: String,
    required: true
  },
  nama_baru: {
    type: String,
    required: true
  },
  id_matkul: {
    type: String,
    required: true
  }
});

const Materi = (module.exports = mongoose.model('materi', MateriSchema));

module.exports.getMateriByIdMatkul = function(id, callback) {
  const query = { id_matkul: id };
  Materi.find(query, callback);
};

module.exports.addMateri = function(newMateri, callback) {
  newMateri.save(callback);
};
