const axios = require('axios');

// move later to helpers folder
function unixConverter(unixTime) {
  const  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const weekdays_short = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const date = new Date(unixTime * 1000);
  const year = date.getFullYear();
  const month = date.getMonth()+1;
  const day = date.getDate();
  const day_num = date.getDay();
  const weekday = weekdays[day_num];
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const month_letters = months[month-1];
  const weekday_short = weekdays_short[day_num];
  return {year, month, day, hours, minutes, seconds, weekday, weekday_short, month_letters};
}
// module.exports = unixConverter;

function tempDataForGraph(data) {
  let days = [];
  let tempsDay = [];
  let tempsNight = [];
  let days_letters = [];
  let weathers = [];
  let icons = [];
  data.forEach(day => {
    const time = unixConverter(day.dt);
    days.push(`${time.day}/${time.month}`);
    tempsDay.push(day.temp.day);
    tempsNight.push(day.temp.night);
    days_letters.push(unixConverter(day.dt).weekday_short);
    weathers.push(day.weather[0].main);
    icons.push(`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`);
  });
  return {days, tempsDay, tempsNight, days_letters, weathers, icons};
}

async function getImage(city) {
  let imageUrl = '';
  try {
    // imageUrl = (await axios.get(`https://api.teleport.org/api/urban_areas/slug:${city.name.toLowerCase()}/images/`)).data.photos[0].image.mobile;
    imageUrl = (await axios.get(`https://pixabay.com/api/?key=20293959-d8461f881419a60b2e35d78d7&q=${city.name.toLowerCase()}&image_type=photo&pretty=true&per_page=3`)).data.hits[0].webformatURL;
  } catch (error) {
    imageUrl = '/images/default_city.jpg';
  }
  return imageUrl;
}

module.exports = {tempDataForGraph, unixConverter, getImage};