const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const model = mongoose.model(
  'Email',
  new Schema({
    _id: {
      type: String,
    },
    addressee: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  })
);

module.exports = model;
