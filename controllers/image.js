const Clarifai = require('clarifai');

const returnClarifaiRequestOptions = (imageUrl) => {
  const PAT = '110b9326dd5c47a9b254093ad1fc205c';
  const USER_ID = 'wan0qa9g44e9';
  const APP_ID = 'face-detection';
  const MODEL_ID = 'face-detection';
  const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';
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
    'https://api.clarifai.com/v2/models/face-detection/outputs',
    returnClarifaiRequestOptions(req.body.input)
  )
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      res.json(result); // Send the result as a response to the client
    })
    .catch((error) =>
      res.status(500).json({ error: 'Unable to communicate with API' })
    );
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
