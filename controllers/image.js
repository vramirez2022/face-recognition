const Clarifai = require('clarifai');

const app = new Clarifai.App({
  apiKey: '110b9326dd5c47a9b254093ad1fc205c',
});

const handleApiCall = (req, res) => {
  console.log('Request Body:', req.body); // Log the request body
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, 'image link')
    .then((response) => console.log(response))
    .catch((err) => console.log(err));
};

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then((entries) => {
      res.json(entries[0]);
    })
    .catch((err) => {
      console.error('Database error:', err); // Logging error
      res.status(400).json('Unable to get entries');
    });
};

module.exports = {
  handleImage,
  handleApiCall,
};
