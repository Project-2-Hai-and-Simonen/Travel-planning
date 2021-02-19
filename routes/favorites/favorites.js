const axios = require('axios');
const router = require('express').Router();
const FavoriteCity = require('../../models/FavoriteCity');
const Trip = require('../../models/Trip');
const { loginCheck } = require('../../middlewares/loginCheck');
const helpers = require('../../helpers/helpers');

router.get('/', loginCheck(), async (req, res) => {
  // later change it to user specific
  const user = req.session.user;
  let favoriteCities;
  try {
    favoriteCities = await FavoriteCity.find({user: user._id}).populate('city');
    await favoriteCities.forEach(async (favoriteCity, index) => {
      favoriteCities[index].imageUrl = await helpers.getImage(favoriteCity.city);
    });
  } catch (error) {
    console.log(error);
    res.render('error');
  }

  res.render('favorites/favoriteCities', {favoriteCities, username: user.username});
});

router.post('/', loginCheck(), async (req, res) => {
  const user = req.session.user;
  // later change it to user specific
  console.log(req.body.id);
  // relation with user id later
  try {
    await FavoriteCity.create({user: user._id, city: req.body.id, imageUrl: req.body.image});
    res.redirect('/favorites');
  } catch (error) {
    console.log(error);
    res.render('error');
  }
});

module.exports = router;