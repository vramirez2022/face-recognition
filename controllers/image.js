const Clarifai = require('clarifai');

const handleApiCall = (req, res) => {
  const PAT = '110b9326dd5c47a9b254093ad1fc205c';
  const USER_ID = 'wan0qa9g44e9';
  const APP_ID = 'face-detection';
  const MODEL_ID = 'face-detection';
  const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';

  const IMAGE_URL = this.state.input;

  const raw = JSON.stringify({
    user_app_id: {
      user_id: USER_ID,
      app_id: APP_ID,
    },
    inputs: [
      {
        data: {
          image: {
            url: IMAGE_URL,
          },
        },
      },
    ],
  });

  const requestOptions = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: 'Key ' + PAT,
    },
    body: raw,
  };

  fetch(
    'https://api.clarifai.com/v2/models/' +
      MODEL_ID +
      '/versions/' +
      MODEL_VERSION_ID +
      '/outputs',
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
  console.log(result);
})
.catch((err) => res.status(400).json('unable to work with API'));

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
