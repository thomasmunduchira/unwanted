const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const model = mongoose.model(
  'Tweet',
  new Schema({
    _id: {
      type: String,
    },
    username: {
      type: String,
    },
    fullName: {
      type: String,
    },
    date: {
      type: Number,
    },
    caption: {
      type: String,
    },
  })
);

module.exports = model;
