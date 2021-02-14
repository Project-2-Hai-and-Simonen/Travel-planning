const router = require("express").Router();
const User = require('../../models/User.model');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
const passport = require('passport');
//const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


//sign up
router.get("/signup", (req, res, next) => {
    res.render("auth/signup");
});

router.post('/signup', (req, res, next) => {
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
                res.render('auth/signup', { message: 'The username already exists' });
            } else {
                const salt = bcrypt.genSaltSync(bcryptSalt);
                const hash = bcrypt.hashSync(password, salt)
                User.create({ username: username, password: hash })
                    .then(userFromDB => {
                        console.log(userFromDB);
                        //res.redirect('/');
                        res.redirect('/login');
                    })
            }
        })
        .catch(err => {
            console.log(err);
        })
})

//log in
router.get("/login", (req, res, next) => {
    res.render("auth/login");
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    User.findOne({ username: username })
        .then(userFromDB => {
            if (userFromDB === null) {
                res.render('auth/login', { message: 'Invalid credentials' });
                return;
            }
            if (bcrypt.compareSync(password, userFromDB.password)) {
                req.session.user = userFromDB;
                res.redirect('/memories');
            } else {
                res.render('auth/login', { message: 'Invalid credentials' });
            }
        })
})

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

router.get('/memories', loginCheck(), (req, res) => {
    res.render('auth/memories');
})


module.exports = router;