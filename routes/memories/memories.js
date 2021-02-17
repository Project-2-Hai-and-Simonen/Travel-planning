const router = require("express").Router();
const User = require('../../models/User.model');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
const passport = require('passport');
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Memories = require('../../models/auth/Memories');
const { uploadCloud, cloudinary } = require('../../config/auth/cloudinary');


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

router.post('/test', uploadCloud.single('photo'), (req, res) => {
  console.log(req.file);
});

router.get('/test', (req, res) => {
  res.render('test');
});

router.get('/', loginCheck(), (req, res) => {
  // console.log(req.session.user);
  const username = req.session.user.username;
  const userID = req.session.user._id;
  // only the memories of current users - hai
  Memories.find({user: userID})
    .populate('city')
    .then(memories => {
        res.render('memories/memories', { memories, username });
    })
    .catch(err => {
        console.log(err);
        res.render('error');
    });
});

// Hai add memories/:id
router.get('/:id', loginCheck(), (req, res) => {
  const username = req.session.user.username;
  const userID = req.session.user._id;
  Memories.findOne({user: userID, _id: req.params.id})
    .populate('city')
    .then(memory => {
      res.render('memories/memory', { memory, username });
    })
    .catch(err => {
      console.log(err);
      res.render('error');
    });
});

router.post('/:memoryID', uploadCloud.single('photo'), loginCheck(), async (req, res) => {
  const user = req.session.user;
  const {imgCaption, description} = req.body;
  const imgPath = req.file.path;
  const imgName = req.file.originalname;
  try {
    let memory = await Memories.findOne({user: user._id, _id: req.params.memoryID});
    memory.stories.push({imgCaption, description, imgName, imgPath});
    await memory.save();
    res.redirect(`/memories/${req.params.memoryID}`);
  } catch (error) {
    console.log(error);
    res.render('error');
  }
});

//add memories
router.get('/add', (req, res, next) => {
  res.render('auth/memories-add');
});

router.post('/add', uploadCloud.single('photo'), loginCheck(), (req, res, next) => {
  console.log('?????', req.file);
  const name = req.body.name;
  const description = req.body.description;
  const imgPath = req.file.path;
  const imgName = req.file.originalname;
  const publicId = req.file.filename
  Memories.create({ name, description, imgPath, imgName, publicId })
      .then(() => {
          res.redirect('/memories')
      })
      .catch(err => {
          next(err);
      })
});

module.exports = router;