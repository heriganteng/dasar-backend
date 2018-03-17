// Mata kuliah untuk file materi
// Model matkul disebelah diganti kelas ok?

const mongoose = require('mongoose');
const config = require('../config/database');

// Skema Matkul
const MataKuliahSchema = mongoose.Schema({
  kode_matkul: {
    type: String,
    required: true
  },
  nama_matkul: {
    type: String,
    required: true
  }
});

const MataKuliah = (module.exports = mongoose.model('matakuliah', MataKuliahSchema));

