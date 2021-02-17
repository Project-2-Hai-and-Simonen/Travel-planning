const axios = require('axios');
const router = require('express').Router();
const FavoriteCity = require('../../models/FavoriteCity');
const Trip = require('../../models/Trip');

router.get('/', async (req, res) => {
  // allow only user seeing its own trips
  let trips;
  try {
    // add {user: req.user/session.id} later
    trips = await Trip.find().populate('city');
    res.render('favorites/visitedCities', {trips});
  } catch (error) {
    console.log(error);
    res.render('error');
  }
});


router.post('/:id', async (req, res) => {
  // add user id here later from the request
  const cityId = req.params.id;
  const {fromDate, toDate, travellersNum, cost, summary, rating, image } = req.body;
  try {
    await Trip.create({city: cityId, fromDate, toDate, travellersNum, cost, summary, rating, img_default: image});
    res.redirect('/visited');
  } catch (error) {
    console.log(error);
    res.render('error');
  }
});

module.exports = router;