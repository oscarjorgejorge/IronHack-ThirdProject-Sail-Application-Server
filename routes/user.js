'user strict';

const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Trip = require('../models/trip');

// --- POST Profile
router.post('/edit', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.status(401).json({error: 'unauthorized'});
  }

  const updates = {
    email: req.body.email,
    description: req.body.description
  };
  const id = req.session.currentUser._id;

  // --- data validation for edit form
  if (updates.email === '') {
    return res.status(422).json({error: 'validation'});
  }

  User.findByIdAndUpdate(id, updates, {new: true}, (err, newInfo) => {
    if (err) {
      return next(err);
    }
    req.session.currentUser = newInfo;
    return res.json(newInfo);
  });
});

router.post('/delete', (req, res, next) => {
  const id = req.session.currentUser._id;

  Trip.remove({ _creator: id }, function (err) {
    if (err) {
      return next(err);
    }
  });

  User.findByIdAndRemove(id, (err, product) => {
    if (err) {
      return next(err);
    }
    req.session.currentUser = null;
    return res.status(204).send();
  });
});

module.exports = router;
