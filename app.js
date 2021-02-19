// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

// hbs.handlebars.registerHelper('dateFormat', require('handlebars-dateformat'));
var moment = require('moment');
hbs.handlebars.registerHelper('formatTime', function (date, format) {
    var mmnt = moment(date);
    return mmnt.format(format);
});

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require("./config")(app);

// session configuration
const session = require('express-session');

const MongoStore = require('connect-mongo')(session)

const mongoose = require('./db/index');
//const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

app.use(
        session({
            secret: process.env.SESSION_SECRET,
            cookie: { maxAge: 1000 * 60 * 60 * 24 },
            saveUninitialized: false,
            resave: false,
            store: new MongoStore({
                mongooseConnection: mongoose.connection
            }),
            unset: 'destroy'
        })
    )
    // end of session configuration
const User = require('./models/User.model.js');

passport.serializeUser((user, cb) => cb(null, user._id));

passport.deserializeUser((id, cb) => {
    User.findById(id)
        .then(user => cb(null, user))
        .catch(err => cb(err));
});

passport.use(
    new LocalStrategy({ passReqToCallback: true }, {
            usernameField: 'username', // by default //or email
            passwordField: 'password' // by default
        },
        (username, password, done) => {
            User.findOne({ username })
                .then(user => {
                    if (!user) {
                        return done(null, false, { message: 'Incorrect username' });
                    }

                    if (!bcrypt.compareSync(password, user.password)) {
                        return done(null, false, { message: 'Incorrect password' });
                    }

                    done(null, user);
                })
                .catch(err => done(err));
        }
    )
);

app.use(passport.initialize());
app.use(passport.session());
//google access
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
    new GoogleStrategy({
            clientID: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            callbackURL: "/auth/google/callback"
        },
        (accessToken, refreshToken, profile, done) => {
            // to see the structure of the data in received response:
            console.log("Google account details:", profile);

            User.findOne({ googleID: profile.id })
                .then(user => {
                    if (user) {
                        done(null, user);
                        return;
                    }

                    User.create({ googleID: profile.id })
                        .then(newUser => {
                            done(null, newUser);
                        })
                        .catch(err => done(err)); // closes User.create()
                })
                .catch(err => done(err)); // closes User.findOne()
        }
    )
);


// default value for title local
const projectName = "Travel-Planning";
const capitalized = (string) => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}`;

// 👇 Start handling routes here
const index = require("./routes/index");
app.use("/", index);

const auth = require("./routes/auth/auth");
app.use("/auth", auth);

const memories = require("./routes/memories/memories");
app.use("/memories", memories);
const planning = require("./routes/planning/planning");
app.use("/planning", planning);

const search = require("./routes/search/search");
app.use("/search", search);

const details = require("./routes/cityDetails/cityDetails");
app.use("/details", details);

const favorites = require("./routes/favorites/favorites");
app.use("/favorites", favorites);

const vistedTrips = require("./routes/favorites/visited");
app.use("/visited", vistedTrips);



// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;