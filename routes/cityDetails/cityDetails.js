const axios = require('axios');
const router = require('express').Router();
const City = require('../../models/City');
const helpers = require('../../helpers/helpers');

router.get('/:id', async (req, res) => {
  let username;
  try {
    username = req.session.user.username;
  } catch (error) {}
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