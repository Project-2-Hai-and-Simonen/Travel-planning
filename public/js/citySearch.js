mapboxgl.accessToken = 'pk.eyJ1Ijoiam5yZG1ubiIsImEiOiJja2wxN3VtY28zaDdlMm5xbjV5Znh0YnBpIn0.s0Cz8vhJe3T1N2wvocwFzw';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11', // style URL
  center: [13.4, 13.4], // starting position [lng, lat]
  zoom: 1, // starting zoom
  doubleClickZoom: true,
});

const nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-left');

let markers = [];

// list of search results
const searchResultList = document.getElementById('search-result');

// initialize the first most 10-visited cities and map
window.addEventListener('load', async (event) => {
  const top10Cities = (await window.axios.get('search/searchInit')).data;
  cityGenerator(top10Cities);
});

const query = document.getElementById('query');
query.addEventListener('keyup', event => {
  if (event.key === 'Enter') {
    submitForm();
    return false;
  }
});

async function submitForm() {
  const cityData = (await window.axios({
    method: 'post',
    url: 'search',
    headers: {},
    data: {query: query.value}
  })).data;
  searchResultList.innerText = '';
  markers.forEach(marker => marker.remove()); // remove all previous markers
  cityGenerator(cityData);
  map.flyTo({center: cityData[0].loc.coordinates, zoom: 9});
  return false;
}

// go to the place upon click map
function mapLookup(long, lat) {
  map.flyTo({center: [long, lat], zoom: 9});
}


// function here
function cityGenerator(cities) {
  cities.forEach((city, i) => {
    divGenerator(city, searchResultList, i);
    generateMarker(city.loc.coordinates[0], city.loc.coordinates[1], map);
  });
}

// function divGenerator (city, container, index) {
//   let cardColor = index%2===0 ? "card-color-1" : "card-color-2";
//   const div = document.createElement('div');
//   div.className = "card-city";
//   div.classList.add("row");
//   div.classList.add(`${cardColor}`);
//   div.classList.add("mb-1");
//   div.innerHTML = `
//       <div class="col-8">
//         <h4 class="text-white">${city.name}</h4>
//         <h5>${city.country}</h5>
//       </div>
//       <div class="col-4 d-flex justify-content-end">
//         <a href="javascript:mapLookup(${city.loc.coordinates})" class="link-btn btn-view">Map</a>
//         <a href="/details/${city._id}" class="link-btn btn-view">Detail</a>
//       </div>
//     `;
//   container.appendChild(div);
// }

function divGenerator (city, container, index) {
  let cardColor = index%2===0 ? "card-color-1" : "card-color-2";
  const div = document.createElement('div');
  div.innerHTML = `
    <div class="card-city row ${cardColor} mb-1">
      <div class="col-8">
        <h4 class="text-white">${city.name}</h4>
        <h5>${city.country}</h5>
      </div>
      <div class="col-4 d-flex justify-content-end">
        <a href="javascript:mapLookup(${city.loc.coordinates})" class="link-btn btn-view">Map</a>
        <a href="/details/${city._id}" class="link-btn btn-view">Detail</a>
      </div>
    </div>
    `;
  container.appendChild(div.children[0]);
}

// function liGenerator (city, list) {
//   const li = document.createElement("li");
//   // change style="display" later
//   li.innerHTML = `<h2 style="display: inline;">${city.name}, ${city.country}</h2> <a href="/details/${city._id}" class="link-btn">View City</a>`;
//   list.appendChild(li);
// }

function generateMarker(longitude, latitude, map) {
  const marker = new mapboxgl.Marker({
    scale: 1,
    color: 'red',
  })
    .setLngLat([longitude, latitude])
    .addTo(map);
  markers.push(marker);
}

function removeMarkers() {
  map.removeLayer(marker);
}