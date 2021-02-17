const axios = require('axios');
const router = require('express').Router();
const FavoriteCity = require('../../models/FavoriteCity');
const Trip = require('../../models/Trip');
const Memories = require('../../models/auth/Memories');

//middleware
const loginCheck = () => {
  return (req, res, next) => {
      if (req.session.user) {
          next();
      } else {
          res.redirect('/login');
      }
  }
}

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


router.post('/:id', loginCheck(), async (req, res) => {
  // add user id here later from the request
  const cityId = req.params.id;
  const userId = req.session.user._id;
  const {fromDate, toDate, travellersNum, cost, summary, rating, image } = req.body;

  // create the trip 
  try {
    const trip = await Trip.create({city: cityId, fromDate, toDate, travellersNum, cost, summary, rating, img_default: image});
    let memory;
    // check if the memory in this city exists, if not create one
    try {
      memory = await Memories.findOne({user: userId, city: cityId, tripId: trip._id});
      if (memory === null) {
        memory = await Memories.create({user: userId, city: cityId, tripId: trip._id, stories: []});
      }
      // res.redirect('/visited');
      res.redirect(`/memories/${memory._id}`);
    } catch (error) {
      res.render('error');
    }
  } catch (error) {
    console.log(error);
    res.render('error');
  }
});

module.exports = router;