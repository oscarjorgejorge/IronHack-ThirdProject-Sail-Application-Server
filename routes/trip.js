'use strict';

const express = require('express');
const router = express.Router();
const Trip = require('../models/trip');

router.post('/create', (req, res, next) => {
  const tripTitle = req.body.tripTitle;
  const description = req.body.description;
  const image = req.body.image;

  if (!tripTitle || !description) {
    return res.status(424).json({error: 'validation'});
  }

  Trip.findOne({tripTitle}, 'tripTitle')
    .then((tripExists) => {
      if (tripExists) {
        return res.status(422).json({error: 'this-trip-already-exits'});
      }

      const newTrip = new Trip({
        _creator: req.session.currentUser._id,
        // _creator: req.body.user._id,
        tripTitle,
        description,
        image
      });

      return newTrip.save();
      // .then(() => {
      //   req.session.currentUser = newUser;
      //   res.json(newTrip);
      // });
    })
    .catch(next);
});

router.get('/mytrips', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.status(401).json({error: 'unauthorized'});
  }

  Trip.find({_creator: req.session.currentUser._id})
    .then((results) => res.json(results))
    .catch(next);
});

router.get('/trips', (req, res, next) => {
  Trip.find({})
    .then((results) => res.json(results))
    .catch(next);
});

module.exports = router;
