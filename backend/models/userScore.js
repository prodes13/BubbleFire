const mongoose = require('mongoose')
const shortid = require('shortid')

const Schema = mongoose.Schema

var userScore = new Schema({
  name: {
    type: String, 
    required: true,
    maxlength: [20, 'username too long']
  },
  _id: {
    type: String,
    index: true,
    default: shortid.generate
  },
  score: {
    type: Number, 
    required: true,
  },
})

module.exports = mongoose.model('userScore', userScore)