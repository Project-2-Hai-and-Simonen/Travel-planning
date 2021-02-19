const axios = require('axios');
const router = require('express').Router();
const FavoriteCity = require('../../models/FavoriteCity');
const Trip = require('../../models/Trip');
const Memories = require('../../models/auth/Memories');
const { loginCheck } = require('../../middlewares/loginCheck');
const helpers = require('../../helpers/helpers');

router.get('/', loginCheck(), async (req, res) => {
  const user = req.session.user;
  let trips;
  let datesFrom = [];
  let datesTo = [];
  try {
    // add {user: req.user/session.id} later
    trips = await Trip.find({user: user._id}).populate('city');
    // trips.forEach(trip => {
    //   let from = helpers.timeConverter(trip.fromDate.getTime());
    //   let to = helpers.timeConverter(trip.toDate.getTime());
    //   trip.fromDate = `${from.day}:${from.month}:${from.year}`;
    //   trip.toDate = `${to.day}:${to.month}:${to.year}`;
    //   console.log(trip);
    // });
    res.render('favorites/visitedCities', {trips, username: user.username});
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

  // Minimize number of the db calls later
  try {
    const trip = await Trip.create({user: userId, city: cityId, fromDate, toDate, travellersNum, cost, summary, rating, img_default: image});
    let memory;
    // check if the memory in this city exists, if not create one
    try {
      memory = await Memories.findOne({user: userId, city: cityId, tripId: trip._id});
      if (memory === null) {
        memory = await Memories.create({user: userId, city: cityId, tripId: trip._id, stories: []});
      }
      trip.memory = memory._id;
      await trip.save();
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