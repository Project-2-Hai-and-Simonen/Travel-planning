const axios = require('axios');

// move later to helpers folder
function unixConverter(unixTime) {
  const date = new Date(unixTime * 1000);
  const year = date.getFullYear();
  const month = date.getMonth()+1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return {year, month, day, hours, minutes, seconds};
}
// module.exports = unixConverter;

function tempDataForGraph(data) {
  let days = [];
  let tempsDay = [];
  let tempsNight = [];
  data.forEach(day => {
    const time = unixConverter(day.dt);
    days.push(`${time.day}/${time.month}`);
    tempsDay.push(day.temp.day);
    tempsNight.push(day.temp.night);
  });
  return {days, tempsDay, tempsNight};
}

async function getImage(city) {
  let imageUrl = '';
  try {
    // imageUrl = (await axios.get(`https://api.teleport.org/api/urban_areas/slug:${city.name.toLowerCase()}/images/`)).data.photos[0].image.mobile;
    imageUrl = (await axios.get(`https://pixabay.com/api/?key=20293959-d8461f881419a60b2e35d78d7&q=${city.name.toLowerCase()}&image_type=photo&pretty=true`)).data.hits[0].webformatURL;
  } catch (error) {
    imageUrl = '/images/default_city.jpg';
  }
  return imageUrl;
}

module.exports = {tempDataForGraph, unixConverter, getImage};