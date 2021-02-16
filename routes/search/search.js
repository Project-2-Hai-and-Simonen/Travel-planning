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


module.exports = router;



// image: https://api.teleport.org/api/urban_areas/slug:berlin/images/
// nearby city: https://api.teleport.org/api/locations/37.77493,-122.41942/
// city score: https://api.teleport.org/api/urban_areas/slug:san-francisco-bay-area/scores/
// focast: https://pro.openweathermap.org/data/2.5/forecast/climate?lat={lat}&lon={lon}&appid={API key}
// focast:
// [{
//   "dt": 1595268000,
//   "sunrise": 1608124431,
//   "sunset": 1608160224,
//   "temp": {
//     "day": 278.14,
//     "min": 273.15,
//     "max": 279.4,
//     "night": 273.15,
//     "eve": 275.82,
//     "morn": 275.35
//   },
//   "feels_like": {
//     "day": 273.53,
//     "night": 270.26,
//     "eve": 271.89,
//     "morn": 272.11
//   },
//   "pressure": 1021,
//   "humidity": 70,
//   "dew_point": 273.27,
//   "wind_speed": 3.74,
//   "wind_deg": 323,
//   "weather": [
//     {
//       "id": 803,
//       "main": "Clouds",
//       "description": "broken clouds",
//       "icon": "04d"
//     }
//   ],
//   "clouds": 60,
//   "pop": 0.84,
//   "uvi": 2.41
// }],

// Convert Unix timestamp
// let unix_timestamp = 1549312452
// // Create a new JavaScript Date object based on the timestamp
// // multiplied by 1000 so that the argument is in milliseconds, not seconds.
// var date = new Date(unix_timestamp * 1000);
// // Hours part from the timestamp
// var hours = date.getHours();
// // Minutes part from the timestamp
// var minutes = "0" + date.getMinutes();
// // Seconds part from the timestamp
// var seconds = "0" + date.getSeconds();

// // Will display time in 10:30:23 format
// var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

// console.log(formattedTime);