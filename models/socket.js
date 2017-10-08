const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const model = mongoose.model(
  'Socket',
  new Schema({
    _id: {
      type: String,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  })
);

module.exports = model;
