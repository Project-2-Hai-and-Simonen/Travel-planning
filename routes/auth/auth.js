const router = require("express").Router();
const User = require('../../models/User.model');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
const passport = require('passport');
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Memories = require('../../models/auth/Memories');
const Vacation = require('../../models/auth/Vacation');
const { uploadCloud, cloudinary } = require('../../config/auth/cloudinary');
const { loginCheck } = require('../../middlewares/loginCheck');

router.get(
    "/google",
    passport.authenticate("google", {
        scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email"
        ]
    })
);
router.get(
    "/google/callback",
    passport.authenticate("google", {
        successRedirect: "/",
        failureRedirect: "/" // here you would redirect to the login page using traditional login approach
    })
);
//sign up
// router.get("/signup", (req, res, next) => {
//     let username;
//     try {
//         username = req.session.user.username;
//     } catch (error) {}
//     res.render("auth/signup");
// });

router.post('/signup', (req, res, next) => {
    const { username, password, firstName, lastName, email, confirmation} = req.body;
    if (password.length < 8) {
        return res.json({ message: 'Your password has to be 8 chars min', success: 0});
    }
    if (username === '') {
        res.json({ message: 'Your username cannot be empty', success: 0});
        return;
    }
    if (password !== confirmation) {
        res.json({ message: 'Passwords not match', success: 0});
    }

    User.findOne({ username: username })
        .then(userFromDB => {
            if (userFromDB !== null) {
                res.json({ message: 'The username already exists', success: 0});
            } else {
                const salt = bcrypt.genSaltSync(bcryptSalt);
                const hash = bcrypt.hashSync(password, salt)
                User.create({ username: username, password: hash, firstName, lastName, email })
                    .then(userFromDB => {
                        console.log(userFromDB);
                        //res.redirect('/');
                        req.session.user = userFromDB;
                        res.json({message: "success", success: 1});
                    });
            }
        })
        .catch(err => {
            console.log(err);
        });
});

// //log in
// router.get("/login", (req, res, next) => {
//     let username;
//     try {
//         username = req.session.user.username;
//     } catch (error) {}
//     res.render("auth/login");
// });

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    User.findOne({ username: username })
        .then(userFromDB => {
            if (userFromDB === null) {
                return res.json({message: 'Invalid credentials', success: 0});
                // return res.render('auth/login', { message: 'Invalid credentials' });
            }
            if (bcrypt.compareSync(password, userFromDB.password)) {
                req.session.user = userFromDB;
                res.json({message: "success", success: 1});
            } else {
                return res.json({message: 'Invalid credentials', success: 0});
            }
        });
});

// hai add logout
router.get('/logout', (req, res) => {
    req.logout();
    req.session = null;
    res.redirect('/');
});


// Hai change the lines to memories.js

// router.get('/private', loginCheck(), (req, res) => {
//     res.render('auth/private', { user: req.session.user });
// })

router.get('/planning', loginCheck(), (req, res) => {
    res.render('auth/planning', { user: req.session.user });
});

// I would remove this
router.get('/city/:id', loginCheck(), (req, res, next) => {
    const cityId = req.params.id;
    Memories.findById(cityId)
        .then(city => {
            console.log(city);
            res.render('auth/city-show', { show: city })
        });
});

//edit & delete memories

// router.get('/city/:id/delete', (req, res) => {
//     const cityId = req.params.id;
//     Memories.findByIdAndDelete(cityId)
//         .then(() => {
//             res.redirect('/memories')
//         })
//         .catch(err => {
//             console.log(err);
//         })
// })

module.exports = router;