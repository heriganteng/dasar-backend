const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

// Connect To Database
mongoose.Promise = require('bluebird');
mongoose
  .connect(config.database, { promiseLibrary: require('bluebird') })
  .then(() => console.log(`Connected to database ${config.database}`))
  .catch(err => console.log(`Database error: ${err}`));

const app = express();

const mahasiswa = require('./routes/mahasiswa');
const kelas = require('./routes/kelas');
const matakuliah = require('./routes/mata-kuliah');
const absensi = require('./routes/absensi');
const fileRoutes = require('./routes/file');
const materi = require('./routes/materi');
const nilai = require('./routes/nilai');
// Port Number
const port = process.env.PORT || 8080;

// CORS Middleware
app.use(cors());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

// Body Parser Middleware
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'POST, GET, PATCH, DELETE, OPTIONS'
  );
  next();
});

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/mahasiswa', mahasiswa);
app.use('/kelas', kelas);
app.use('/absensi', absensi);
app.use('/file', fileRoutes);
app.use('/matakuliah', matakuliah);
app.use('/materi', materi);
app.use('/nilai', nilai);

// Index Route
app.get('/', (req, res) => {
  res.send('Invalid Endpoint');
});

// Start Server
app.listen(port, () => {
  console.log('Server started on port ' + port);
});
