const router = require('express').Router();
const CityLocation = require('../../models/CityLocation');

router.get('/', (req, res) => {
  res.render('search/search');
});

// request from frontend js via axios
router.get('/test', (req, res) => {
  console.log("controller successful");
  CityLocation.find().limit(10)
    .then(cities => {
      res.json(cities);
    })
    .catch(error => console.log(error)); // later error page
});

module.exports = router;