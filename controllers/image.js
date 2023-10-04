const app = new Clarifai.App({
  apiKey: '110b9326dd5c47a9b254093ad1fc205c',
});
const handleApiCall = (req, res) => {
  console.log('imageurl: ', req.body.input);
  fetch(
    'https://api.clarifai.com/v2/models/face-detection/outputs',
    returnClarifaiRequestOptions(req.body.input)
  )
    .then((response) => response.json())
    .then((data) => {
      console.log('Clarifai API response:', data);
      res.json(data);
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
