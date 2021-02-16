const axios = require('axios');
const router = require('express').Router();
const City = require('../../models/City');
const Country = require('../../models/Country');
const Top10City = require('../../models/Top10City');
const helpers = require('../../helpers/helpers');

router.get('/:id', async (req, res) => {
  const city = await City.findById(req.params.id);
  // console.log(city);
  // const country = await Country.findOne({name: {$regex : new RegExp(city.country, "i")}}).populate("language");
  // console.log(country);

  // living scores and short city summary
  let cityScores;
  let summary;
  try {
    const data = (await axios.get(`https://api.teleport.org/api/urban_areas/slug:${city.name.toLowerCase()}/scores/`)).data;
    cityScores = data.categories;
    summary = data.summary.replace(/Teleport/gi, "Travel-Planning");
  } catch (error) {
    summary = `Unfortunately, we can not summarize a great city like ${city.name} in one sentence. Now is the time for you to learn about the city in several other sources`;
  }

  // current weather
  const coords = city.loc.coordinates;
  const api = `http://api.openweathermap.org/data/2.5/weather?lat=${coords[1]}&lon=${coords[0]}&appid=${process.env.WEATHER_KEY}&units=metric`;
  let currentWeather;
  let weatherMessage;
  try {
    currentWeather = (await axios.get(api)).data;
    // fix timezone
    let sunrise = helpers.unixConverter(currentWeather.sys.sunrise);
    let sunset = helpers.unixConverter(currentWeather.sys.sunset);
    currentWeather.sys.sunrise = `${sunrise.hours}:${sunrise.minutes}`;
    currentWeather.sys.sunset = `${sunset.hours}:${sunset.minutes}`;
  } catch (error) {
    weatherMessage = `Unfortunately, we do not have weather information available for ${city.name}`;
  }
  

  // image of the city
  let imageUrl = await helpers.getImage(city);
  
  res.render('cityDetails/cityDetails', {city,summary, currentWeather, imageUrl, weatherMessage});
});


router.get('/:id/7days', async (req, res) => {
  const city = await City.findById(req.params.id);
  let temps7Days;
  let message;
  const coords = city.loc.coordinates;
  let api = `https://api.openweathermap.org/data/2.5/onecall?lat=${coords[1]}&lon=${coords[0]}&exclude=current,minutely,hourly&appid=${process.env.WEATHER_KEY}&units=metric`;
  try {
    const data = (await axios.get(api)).data.daily;
    temps7Days = helpers.tempDataForGraph(data);
  } catch (error) {
    message = "Unfortunately, no forcasted data";
  }

  res.json({temps7Days, message});
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