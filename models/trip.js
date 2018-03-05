'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const userSchema = new Schema({
  _creator: { type: ObjectId, ref: 'User' },
  tripTitle: String,
  description: String,
  image: String,
  isAvailable: { type: Boolean, default: true },
  request: Array
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Trip = mongoose.model('Trip', userSchema);

module.exports = Trip;
