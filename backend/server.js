const express     = require('express');
const bodyParser  = require('body-parser');

const dotenv = require('dotenv');
dotenv.config();
const app = express();



const cors = require('cors')

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE);

app.use(cors())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// start

const UserScore = require('./models/userScore');

app.route('/new-score').post((req, res, next) => {
  const user = new UserScore(req.body);
  user.save((err, savedUser) => { 
    if (err) return next(err);
    res.json({
      name: savedUser.name,
      _id: savedUser._id,
      score: savedUser.score
    })
  })
})

app.route('/scores').get((req,res,next) => {
    UserScore.find({}, (err, data) => {
    if (err) return next(err);
    res.json(data)
  })
})

// end


const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Your app is listening on port ' + listener.address().port)
  })