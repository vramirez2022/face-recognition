const Clarifai = require('clarifai');
const fetch = require('node-fetch');

const handleApiCall = (req, res, imageUrl) => {
  const PAT = '110b9326dd5c47a9b254093ad1fc205c';
  const USER_ID = 'wan0qa9g44e9';
  const APP_ID = 'face-detection';
  const MODEL_ID = 'face-detection';
  const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';

  const raw = JSON.stringify({
    user_app_id: {
      user_id: USER_ID,
      app_id: APP_ID,
    },
    inputs: [
      {
        data: {
          image: {
            url: imageUrl,
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
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error('Unable to work with API');
      }
    })
    .then((result) => {
      console.log('Clarifai API response:', result);
      res.json(result);
    })
    .catch((err) => {
      console.error(err);
      res.status(400).json('Unable to work with API');
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
