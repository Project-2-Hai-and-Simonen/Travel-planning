const router = require("express").Router();
const User = require('../models/User.model');
const bcrypt = require('bcrypt');
//const passport = require('passport');
//const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

//home page
router.get("/", (req, res, next) => {
    const user = req.session.user;
    //console.log(req.session)
    res.render("index", { user: user });
});

//sign up
router.get("/signup", (req, res, next) => {
    res.render("signup");
});

router.post('/signup', (req, res) => {
    const { username, password } = req.body;
    console.log(username, password);
    if (password.length < 8) {
        return res.render('signup', { message: 'Your password has to be 8 chars min' });
    }
    if (username === '') {
        res.render('signup', { message: 'Your username cannot be empty' });
        return
    }

    User.findOne({ username: username })
        .then(userFromDB => {
            if (userFromDB !== null) {
                res.render('signup', { message: 'Username is already taken' });
            } else {
                const salt = bcrypt.genSaltSync();
                const hash = bcrypt.hashSync(password, salt)
                User.create({ username: username, password: hash })
                    .then(userFromDB => {
                        console.log(userFromDB);
                        res.redirect('/');
                    })
            }
        })
        .catch(err => {
            console.log(err);
        })
})

//log in
router.get("/login", (req, res, next) => {
    res.render("login");
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    User.findOne({ username: username })
        .then(userFromDB => {
            if (userFromDB === null) {
                res.render('login', { message: 'Invalid credentials' });
                return;
            }
            if (bcrypt.compareSync(password, userFromDB.password)) {
                req.session.user = userFromDB;
                res.redirect('/main');
            } else {
                res.render('login', { message: 'Invalid credentials' });
            }
        })
})


module.exports = router;