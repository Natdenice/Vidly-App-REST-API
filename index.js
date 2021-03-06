/* eslint-disable no-console */
/* eslint-disable radix */
const mongoose = require('mongoose');
const config = require('config');
const morgan = require('morgan');
const helmet = require('helmet');
// eslint-disable-next-line no-unused-vars
const Joi = require('@hapi/joi');
const express = require('express');
const auth = require('./routes/auth');
const homepage = require('./routes/homepage');
const logger = require('./middleware/logger');
const genres = require('./routes/genres');
const movies = require('./routes/movies');
const users = require('./routes/users');
const customers = require('./routes/customers');
const rentals = require('./routes/rentals');

const app = express();

// To detect in which environnement the app is running
// console.log(`Application Name: ${config.get('name')}`);
// console.log(`Mail Server: ${config.get('mail.host')}`);

if (!config.get('jwtPrivateKey')) {
  console.log('Fatal Error : JWT Private Key is not defined !');
  // and then we need to exit process
  process.exit(0);
  // 0 means success, anything other than 0 means failure
  // process.exit(1) is for exit the process in case of error
  // when jwtprivatekey is not defined , node doesnt respond to any request received from clients
}

// Use
if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  console.log('Morgan Enabled...');
}

// Connect to Database

mongoose
  .connect('mongodb://localhost/vidly')
  .then(() => console.log('Connected to DataBase...'))
  .catch(err => console.log('Could not connect to Database', err.message));
// We dont have to require templating engine at the bottom

app.set('view engine', 'pug');
app.set('views', './views'); // default
app.use(express.json());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(logger);

// We are telling to express that for any routes with this endpoint ,
// use the router
app.use('/api/genres', genres);
app.use('/', homepage);
app.use('/api/auth', auth);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);

// Get the HomePage of Vidly APP
app.get('/', (req, res) => {
  res.status(200).send('Welcome to The Official Vidly APP Rental Service!');
});

// Define our port - choose env.PORT or 3000
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
