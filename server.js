const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const app = express();
require('dotenv').config();

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    port: 5432,
    user: 'postgres',
    password: 'test',
    database: 'smart_brain',
  },
});
db.select('*')
  .from('users')
  .then((data) => {});

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send(db.users);
});
app.post('/signin', signin.handleSignin(db, bcrypt));

app.post('/register', (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});
app.get('/profile/:id', (req, res) => {
  profile.handleProfileGet(req, res, db);
});
app.put('/image', (req, res) => {
  image.handleImage(req, res, db);
});
app.post('/imageUrl', (req, res) => {
  const { imageUrl } = req.body;
  image.handleApiCall(req, res, imageUrl);
});

app.listen(3000, () => {
  console.log('app is running on port 3000');
});
