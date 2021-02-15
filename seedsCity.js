const mongoose = require('mongoose');

const CityLocation = require('./models/CityLocation');

mongoose.connect(process.env.MONGODB_URI, {
  userNewUrlParser: true,
});

const top10Cities = [
  {
    name: 'Berlin',
    country: 'Germany',
    longitude: 13.405,
    latitude: 52.52,
    flag: 'https://restcountries.eu/data/deu.svg',
  },
  {
    name: 'Rom',
    country: 'Italy',
    longitude: 12.4964,
    latitude: 41.9028,
    flag: 'https://restcountries.eu/data/ita.svg',
  },
  {
    name: 'Hanoi',
    country: 'Vietnam',
    longitude: 105.8342,
    latitude: 21.0278,
    flag: 'https://restcountries.eu/data/vnm.svg',
  },
  {
    name: 'Paris',
    country: 'France',
    longitude: 2.3522,
    latitude: 48.8566,
    flag: 'https://restcountries.eu/data/fra.svg',
  },
  {
    name: 'London',
    country: 'England',
    longitude: 0.1278,
    latitude: 51.5074,
    flag: 'https://restcountries.eu/data/gbr.svg',
  },
  {
    name: 'New York',
    country: 'USA',
    longitude: 74.0060,
    latitude: 40.7128,
    flag: 'https://restcountries.eu/data/umi.svg',
  },
  {
    name: 'Bangkok',
    country: 'Thailand',
    longitude: 100.5018,
    latitude: 13.7563,
    flag: 'https://restcountries.eu/data/tha.svg',
  },
  {
    name: 'Hong Kong',
    country: 'Hong Kong',
    longitude: 114.1694,
    latitude: 22.3193,
    flag: 'https://restcountries.eu/data/hkg.svg',
  },
  {
    name: 'Dubai',
    country: 'United Arab Emirates',
    longitude: 55.2708,
    latitude: 25.2048,
    flag: 'https://restcountries.eu/data/are.svg',
  },
  {
    name: 'Istanbul',
    country: 'Turkey',
    longitude: 28.9784,
    latitude: 41.0082,
    flag: 'https://restcountries.eu/data/tur.svg',
  },
];

top10Cities.forEach(city => {
  CityLocation.create(city);
});

