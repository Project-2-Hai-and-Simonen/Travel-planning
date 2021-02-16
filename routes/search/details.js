const axios = require('axios');
const router = require('express').Router();
const City = require('../../models/City');
const Country = require('../../models/Country');
const Top10City = require('../../models/Top10City');
const { tempDataForGraph } = require('../../helpers/helpers'); 

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
  } catch (error) {
    weatherMessage = `Unfortunately, we do not have weather information available for ${city.name}`;
    // res.render('error', {message: "No weather information on this city"});
  }

  // image of the city
  let imageUrl = '';
  try {
    // imageUrl = (await axios.get(`https://api.teleport.org/api/urban_areas/slug:${city.name.toLowerCase()}/images/`)).data.photos[0].image.mobile;
    imageUrl = (await axios.get(`https://pixabay.com/api/?key=20293959-d8461f881419a60b2e35d78d7&q=${city.name.toLowerCase()}&image_type=photo&pretty=true`)).data.hits[0].webformatURL;
  } catch (error) {
    imageUrl = '/images/default_city.jpg';
  }
  // console.log(imageUrl);
  
  res.render('search/cityDetails', {city,summary, currentWeather, imageUrl, weatherMessage});
});


router.get('/7days', async (req, res) => {
  let temps7Days;
  let message;
  try {
    const data = (await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${coords[1]}&lon=${coords[0]}&exclude=current,minutely,hourly&appid=${process.env.WEATHER_KEY}&units=metric`)).data.daily;
    temps7Days = tempDataForGraph(data);
  } catch (error) {
    message = "Unfortunately, no forcasted data";
  }

  res.json({temps7Days, message});
});

module.exports = router;