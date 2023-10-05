const Clarifai = require('clarifai');
const fetch = require('node-fetch'); // Import the 'node-fetch' library

const returnClarifaiRequestOptions = (imageUrl) => {
  const PAT = '110b9326dd5c47a9b254093ad1fc205c';
  const USER_ID = 'wan0qa9g44e9';
  const APP_ID = 'face-detection';
  const MODEL_ID = 'face-detection';
  const IMAGE_URL = imageUrl;
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
  console.log(requestOptions);
  return requestOptions;
};

const handleApiCall = (req, res) => {
  console.log('imageurl: ', req.body.input);
  fetch(
    'https://api.clarifai.com/v2/models/' + 'face-detection' + '/outputs',
    returnClarifaiRequestOptions(req.body.input)
  )
    .then((response) => response.json())
    .then((data) => {
      // Fix the syntax here
      console.log('Clarifai API response', data);
      res.json(data); // Fix the syntax here
    })
    .catch((err) => res.status(400).json('unable to work with api'));
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
