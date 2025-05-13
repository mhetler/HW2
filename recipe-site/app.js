console.log('App is starting...');

const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const app = express();
const indexRouter = require('./routes/index');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Longhorn10', // Set your password here if needed
  database: 'recipes_db'
});

app.locals.db = db;

app.use('/', indexRouter);

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
