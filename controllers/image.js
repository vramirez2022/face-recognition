const Clarifai = require('clarifai');
const { response } = require('express');
const fetch = require('node-fetch');
const { ClarifaiStub, grpc } = require('clarifai-nodejs-grpc');

const handleApiCall = (req, res, imageUrl) => {
  const PAT = '110b9326dd5c47a9b254093ad1fc205c';
  const USER_ID = 'wan0qa9g44e9';
  const APP_ID = 'face-detection';
  const MODEL_ID = 'face-detection';
  const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';
  const IMAGE_URL = imageUrl;

  const stub = ClarifaiStub.grpc();

  const metadata = new grpc.Metadata();
  metadata.set('authorization', 'Key ' + PAT);

  stub.PostModelOutputs(
    {
      user_app_id: {
        user_id: USER_ID,
        app_id: APP_ID,
      },
      model_id: MODEL_ID,
      version_id: MODEL_VERSION_ID,
      inputs: [
        { data: { image: { url: IMAGE_URL, allow_duplicate_url: true } } },
      ],
    },
    metadata,
    (err, response) => {
      if (err) {
        throw new Error(err);
      }

      if (response.status.code !== 10000) {
        throw new Error(
          'Post model outputs failed, status: ' + response.status.description
        );
      }

      const output = response.outputs[0];

      console.log('Predicted concepts:');
      for (const concept of output.data.concepts) {
        console.log(concept.name + ' ' + concept.value);
      }
    }
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
