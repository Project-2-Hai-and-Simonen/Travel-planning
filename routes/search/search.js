const axios = require('axios');
const router = require('express').Router();
const City = require('../../models/City');
const Country = require('../../models/Country');
const Top10City = require('../../models/Top10City');


router.get('/', (req, res) => {
  res.render('search/search');
});

// request from frontend js via axios
router.get('/searchInit', (req, res) => {
  console.log("controller successful");
  Top10City.find()
    .populate('city')
    .then(cities => {
      cities = cities.map(city => city.city);
      res.json(cities);
    })
    .catch(error => console.log(error)); // later error page
});

router.post('/', async (req, res) => {
  let cities = await City.find({name: {$regex: new RegExp(req.body.query, 'i')}}).limit(3);
  if (cities.length > 0) {
    const [lng, lat] = cities[0].loc.coordinates;
    // console.log(cities[0].loc.coordinates)
    const extraCities = await City.find({
      loc: {$near: {$geometry: {type: "Point",  coordinates: [ lng, lat ]}, $maxDistance: 5000000 }} // 5000 km from the city
    }).limit(10);
    cities = [...cities, ...extraCities.slice(1, 11-cities.length)]; // make sure to get 10 results
  }
  if (cities.length === 0) { // if still get 0 result when included the distance search
    cities = await Top10City.find().populate('city');
    cities = cities.map(city => city.city);
  }
  res.json(cities);
});

router.get('/:id', async (req, res) => {
  console.log(req.params.id);
  const city = await City.findById(req.params.id);
  // const country = await Country.findOne({name: {$regex : new RegExp(city.country, "i")}}).populate("language");
  // console.log(country);
  console.log(city);
  const coords = city.loc.coordinates;
  const api = `http://api.openweathermap.org/data/2.5/weather?lat=${coords[1]}&lon=${coords[0]}&appid=${process.env.WEATHER_KEY}`;
  const currentWeather = (await axios.get(api)).data;
  // console.log(currentWeather);
  // temperature is kelvin
  res.render('search/cityDetails', {city, currentWeather});
});
module.exports = router;