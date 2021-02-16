// move later to helpers folder
function unixConverter(unixTime) {
  const date = new Date(unixTime * 1000);
  const year = date.getFullYear();
  const month = date.getMonth();
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
module.exports = {tempDataForGraph, unixConverter};