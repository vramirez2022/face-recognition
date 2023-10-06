const Clarifai = require('clarifai');

const API_KEY = '110b9326dd5c47a9b254093ad1fc205c';
const MODEL_ID = 'face-detection';
const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';

const clarifaiApp = new Clarifai.App({ apiKey: API_KEY });

const handleApiCall = (req, res) => {
  clarifaiApp.models
    .predict(MODEL_ID, MODEL_VERSION_ID, input)
    .then((data) => {
      res.json(data);
      console.log('Clarifai API response', data);
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .json({ error: 'Unable to communicate with Clarifai API' });
    });
};

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then((entries) => {
      res.json(entries[0].entries);
    })
    .catch((err) => res.status(400).json('unable to get entries'));
};

module.exports = {
  handleImage,
  handleApiCall,
};
