const router = require("express").Router();
const User = require('../../models/User.model');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
const passport = require('passport');
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Memories = require('../../models/auth/Memories');
const { uploadCloud, cloudinary } = require('../../config/auth/cloudinary');

router.get(
    "/auth/google",
    passport.authenticate("google", {
        scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email"
        ]
    })
);
router.get(
    "/auth/google/callback",
    passport.authenticate("google", {
        successRedirect: "/private",
        failureRedirect: "/" // here you would redirect to the login page using traditional login approach
    })
);
//sign up
router.get("/signup", (req, res, next) => {
    res.render("auth/signup");
});

router.post('/signup', (req, res, next) => {
    const { username, password } = req.body;
    console.log(username, password);
    if (password.length < 8) {
        return res.render('auth/signup', { message: 'Your password has to be 8 chars min' });
    }
    if (username === '') {
        res.render('auth/signup', { message: 'Your username cannot be empty' });
        return;
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
                res.redirect('/private');
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

// Hai change the lines to memories.js

router.get('/private', loginCheck(), (req, res) => {
    res.render('auth/private', { user: req.session.user });
})

router.get('/planning', loginCheck(), (req, res) => {
    res.render('auth/planning', { user: req.session.user });
})

router.get('/city/:id', loginCheck(), (req, res, next) => {
    const cityId = req.params.id;
    Memories.findById(cityId)
        .then(city => {
            console.log(city);
            res.render('auth/city-show', { show: city })
        })
})

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
router.get('/city/:id/delete', (req, res) => {
    const cityId = req.params.id;
    Memories.findByIdAndDelete(cityId)
        .then(city => {
            if (city.imgPath) {
                cloudinary.uploadCloud.destroy(city.publicId);
            }
            res.redirect('/memories')
        })
        .catch(err => {
            console.log(err);
        })
})

router.get('/city/:id/edit', (req, res, next) => {
    const cityId = req.params.id;
    //console.log('tryId', cityId)
    Memories.findById(cityId)
        .then(cityFromDB => {
            //console.log('test', cityFromDB);
            res.render('auth/edit', { city: cityFromDB });
        })
})

router.post('/city/:id/edit', (req, res) => {
    const cityId = req.params.id;
    const name = req.body.name;
    const description = req.body.description;
    const imgPath = req.file.path;
    const imgName = req.file.originalname;
    console.log(name)
    Memories.findByIdAndUpdate(cityId, {
            name: name,
            description: description,
            imgName: imgName,
            imgPath: imgPath
        })
        .then(city => {
            res.redirect(`/city/${city._id}`);
        })
        .catch(err => {
            console.log(err);
        })
})

module.exports = router;