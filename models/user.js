const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const model = mongoose.model(
  'User',
  new Schema({
    _id: {
      type: String,
    },
  })
);

module.exports = model;
