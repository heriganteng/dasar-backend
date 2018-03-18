const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

// Skema Kelas
const KelasMemberSchema = mongoose.Schema({
  kode_matkul: {
    type: String,
    required: true
  },
  kelas: {
    type: String,
    required: true
  },
  nim: {
    type: String,
    required: true
  }
});

const KelasMember = module.exports = mongoose.model('KelasMember', KelasMemberSchema);

module.exports.getMembers = function(query, callback){
  KelasMember.find(query, callback);
}

module.exports.joinKelas = function(kelas, callback){
  kelas.save(callback);
}