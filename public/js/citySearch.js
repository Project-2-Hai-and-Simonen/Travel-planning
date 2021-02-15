mapboxgl.accessToken = 'pk.eyJ1Ijoiam5yZG1ubiIsImEiOiJja2wxN3VtY28zaDdlMm5xbjV5Znh0YnBpIn0.s0Cz8vhJe3T1N2wvocwFzw';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11', // style URL
  center: [13.4, 13.4], // starting position [lng, lat]
  zoom: 1, // starting zoom
  doubleClickZoom: true,
});

window.addEventListener('load', async (event) => {
  const response = await window.axios.get('search/test');
  const top10Cities = response.data;
  const searchResultList = document.getElementById('city-list');
  top10Cities.forEach(city => {
    liGenerator(city, searchResultList);
    generateMarker(city.longitude, city.latitude, map);
  });
});



function liGenerator (city, list) {
  const li = document.createElement("li");
  li.textContent = city.name;
  list.appendChild(li);
}

// function markerDrawer(longitude, latitude) {

// }

function generateMarker(longitude, latitude, map) {
  new mapboxgl.Marker({
    scale: 1,
    color: 'red',
  })
    .setLngLat([longitude, latitude])
    .addTo(map);
}