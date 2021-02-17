const router = require("express").Router();
const User = require('../../models/User.model');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
const passport = require('passport');
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Memories = require('../../models/auth/Memories');
const Vacation = require('../../models/auth/Vacation');
const { uploadCloud, cloudinary } = require('../../config/auth/cloudinary');

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
        .then(plans => {
            res.render('planning/plans', { user: req.session.user, plans });
        })
        .catch(err => {
            console.log(err);
        })
})

router.get('/add', (req, res, next) => {
    res.render('planning/add-plan');
});

router.post('/add', loginCheck(), (req, res) => {
    //     // a form information
    const location = req.body.location;
    const travelers = req.body.travelers;
    const from = req.body.from;
    const to = req.body.to;
    const budget = req.body.budget;
    const user = req.session.user;

    Vacation.create({ location, travelers, from, to, budget, user: user._id })
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

module.exports = router;