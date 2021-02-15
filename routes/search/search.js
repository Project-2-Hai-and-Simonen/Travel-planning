const router = require('express').Router();
const City = require('../../models/City');
const Top10City = require('../../models/Top10City');

router.get('/', (req, res) => {
  res.render('search/search');
});

// request from frontend js via axios
router.get('/searchInit', (req, res) => {
  console.log("controller successful");
  Top10City.find()
    .then(cities => {
      res.json(cities);
    })
    .catch(error => console.log(error)); // later error page
});

router.post('/', async (req, res) => {
  let cities = await City.find({name: {$regex: new RegExp(req.body.query, 'i')}}).limit(10);
  if (cities.length < 10 && cities.length > 0) {
    const [lng, lat] = cities[0].loc.coordinates;
    // console.log(cities[0].loc.coordinates)
    const extraCities = await City.find({
      loc: {$near: {$geometry: {type: "Point",  coordinates: [ lng, lat ]}, $maxDistance: 5000000 }} // 5000 km from the city
    }).limit(10);
    cities = [...cities, ...extraCities.slice(1, 11-cities.length)]; // make sure to get 10 results
  }
  if (cities.length === 0) { // if still get 0 result when included the distance search
    cities = await Top10City.find();
  }
  res.json(cities);
});

// router.post('/', (req, res) => {
//   console.log(req.body.query);
//   res.json({});
// })
module.exports = router;