const router = require("express").Router();
const User = require('../../models/User.model');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
const passport = require('passport');
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Memories = require('../../models/auth/Memories');
const { uploadCloud, cloudinary } = require('../../config/auth/cloudinary');
const { loginCheck } = require('../../middlewares/loginCheck');

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
router.get('/:memoryID', loginCheck(), (req, res) => {
  const username = req.session.user.username;
  const userID = req.session.user._id;
  Memories.findOne({user: userID, _id: req.params.memoryID})
    .populate('city')
    .then(memory => {
      res.render('memories/memory', { memory, username });
    })
    .catch(err => {
      console.log(err);
      res.render('error');
    });
});

router.post('/:memoryID',loginCheck(), uploadCloud.single('photo'), async (req, res) => {
  const user = req.session.user;
  const {imgCaption, description} = req.body;
  const imgPath = req.file.path;
  const imgName = req.file.originalname;
  const publicId = req.file.filename;
  try {
    let memory = await Memories.findOne({user: user._id, _id: req.params.memoryID});
    memory.stories.push({imgCaption, description, imgName, imgPath, publicId});
    await memory.save();
    res.redirect(`/memories/${req.params.memoryID}`);
  } catch (error) {
    console.log(error);
    res.render('error');
  }
});

// //add memories
// router.get('/add', (req, res, next) => {
//   res.render('auth/memories-add');
// });

// router.post('/add', loginCheck(), uploadCloud.single('photo'), (req, res, next) => {
//   console.log('?????', req.file);
//   const name = req.body.name;
//   const description = req.body.description;
//   const imgPath = req.file.path;
//   const imgName = req.file.originalname;
//   const publicId = req.file.filename;
//   Memories.create({ name, description, imgPath, imgName, publicId })
//       .then(() => {
//           res.redirect('/memories')
//       })
//       .catch(err => {
//           next(err);
//       });
// });

// this is for popup/modal
router.get('/:memoryID/delete/:storyID', loginCheck(), (req, res) => {
  const user = req.session.user;
  const memoryID = req.params.memoryID;
  const storyID = req.params.storyID;
  const cityId = req.params.id;
  Memories.findOne({user: user._id, _id: memoryID})
      .then(async memory => {
        for (let i=0; i < memory.stories.length; i++) {
          let publicId = memory.stories[i].publicId;
          if (memory.stories[i]._id.equals(storyID)) {
            // still not possible to destroy, cloudinary.uploadCloud = undefined
            // cloudinary.uploadCloud.destroy(publicId)
            memory.stories.splice(i, 1);
            await memory.save();
          }
        }
        res.redirect(`/memories/${memoryID}`);
      })
      .catch(err => {
          console.log(err);
      });
});

router.post('/:memoryID/edit/:storyID', (req, res, next) => {
  const user = req.session.user;
  const memoryID = req.params.memoryID;
  const storyID = req.params.storyID;
  //console.log('tryId', cityId)
  Memories.findById(cityId)
      .then(cityFromDB => {
          //console.log('test', cityFromDB);
          res.render('auth/edit', { city: cityFromDB });
      });
});


module.exports = router;