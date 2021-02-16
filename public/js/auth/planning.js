mapboxgl.accessToken = 'pk.eyJ1Ijoic2ltb25lMjMtMTEiLCJhIjoiY2tsNnF4cW1tMTBqcTJvcDY3NmN6M244YiJ9.ZjColm--yWmBLhYmlTf0HQ';

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [13.405, 52.52], // starting position [lng, lat]
    zoom: 1 // starting zoom
});

const nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-left');


const addMarker = (event) => {
    new mapboxgl.Marker({
            scale: 1,
            color: 'red',
            draggable: true
        })
        .setLngLat(event.lngLat)
        .addTo(map)
}

map.on('click', addMarker)