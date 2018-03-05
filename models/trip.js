'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
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
