const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const model = mongoose.model(
  'InstagramPost',
  new Schema({
    _id: {
      type: String,
    },
    username: {
      type: String,
    },
    displaySrc: {
      type: String,
    },
    isVideo: {
      type: Boolean,
    },
  })
);

module.exports = model;
