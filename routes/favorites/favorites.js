const axios = require('axios');
const router = require('express').Router();
const FavoriteCity = require('../../models/FavoriteCity');
const Trip = require('../../models/Trip');

router.get('/', async (req, res) => {
  // later change it to user specific
  let favoriteCities;
  try {
    favoriteCities = await FavoriteCity.find().populate('city');
    console.log(favoriteCities);
  } catch (error) {
    console.log(error);
    res.render('error');
  }

  res.render('favorites/favoriteCities', {favoriteCities});
});

router.post('/', async (req, res) => {
  // later change it to user specific
  console.log(req.body.id);
  // relation with user id later
  try {
    await FavoriteCity.create({city: req.body.id, imageUrl: req.body.image});
    res.redirect('/favorites');
  } catch (error) {
    console.log(error);
    res.render('error');
  }
});

module.exports = router;