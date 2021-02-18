const router = require("express").Router();
const User = require('../../models/User.model');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
const passport = require('passport');
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Memories = require('../../models/auth/Memories');
const Vacation = require('../../models/auth/Vacation');
const { uploadCloud, cloudinary } = require('../../config/auth/cloudinary');
const Favorite = require('../../models/FavoriteCity');

const loginCheck = () => {
        return (req, res, next) => {
            if (req.session.user) {
                next();
            } else {
                res.redirect('/login');
            }
        }
    }
    //  get all plans
router.get('/', loginCheck(), (req, res) => {
    const user = req.session.user;
    Vacation.find({ user: user._id })
        .populate('city')
        .then(plans => {
            console.log(plans)
            res.render('planning/plans', { user: req.session.user, plans });
        })
        .catch(err => {
            console.log(err);
        })
})

router.get('/add', loginCheck(), (req, res, next) => {
    const user = req.session.user;
    Favorite.find({ user: user._id })
        .populate('city')
        .then(cities => {
            res.render('planning/add-plan', { user: req.session.user, cities });
        })
        .catch(err => {
            console.log(err);
        })
});

router.post('/add', loginCheck(), (req, res) => {
    //     // a form information
    const city = req.body.city;
    const travelers = req.body.travelers;
    const from = req.body.from;
    const to = req.body.to;
    const budget = req.body.budget;
    const user = req.session.user;

    Vacation.create({ city, travelers, from, to, budget, user: user._id })
        .then((plan) => {
            console.log(plan)
            res.redirect('/planning')
        })
        .catch(err => {
            console.log("erro:", err);
            next(err);
        })
});

router.get('/:id', loginCheck(), (req, res, next) => {
    const user = req.session.user;
    Vacation.findOne({ user: user._id, _id: req.params.id })
        .populate('city')
        .then(plan => {
            console.log(plan);
            res.render('planning/plan', { plan })
        })
        .catch(err => {
            console.log("erro:", err);
            next(err);
        })
})

router.get('/:id/delete', (req, res) => {
    const user = req.session.user;
    Vacation.findOneAndDelete({ user: user._id, _id: req.params.id })
        .then(plan => {
            res.redirect('/planning')
        })
        .catch(err => {
            console.log(err);
        })
})


router.get('/:id/edit', (req, res, next) => {
    const user = req.session.user;
    Vacation.findOne({ user: user._id, _id: req.params.id })
        .then(planFromDB => {
            res.render('planning/edit', { city: planFromDB });
        })
        .catch(err => {
            console.log(err);
        })
})

router.post('/:id/edit', (req, res) => {
    const cityId = req.params.id;
    const location = req.body.location;
    const travelers = req.body.travelers;
    const from = req.body.from;
    const to = req.body.to;
    const budget = req.body.budget;
    const user = req.session.user;
    Vacation.findOneAndUpdate(cityId, {
            location: location,
            travelers: travelers,
            from: from,
            to: to,
            budget: budget

        })
        .then(city => {
            res.redirect(`/${city._id}`);
        })
        .catch(err => {
            console.log(err);
        })
})

module.exports = router;