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
        tripTitle,
        description,
        image
      });

      newTrip.save()
        .then((trip) => {
          res.json(trip);
        });
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

router.post('/mytrips/edit/:id', (req, res, next) => {
  const tridId = req.body._id;
  const updates = {
    tripTitle: req.body.tripTitle,
    description: req.body.description,
    image: req.body.image
  };

  Trip.findByIdAndUpdate(tridId, updates, {new: true}, (err, newInfo) => {
    if (err) {
      return next(err);
    }
    return res.json(newInfo);
  });
});

router.get('/trips/:id', (req, res, next) => {
  Trip.findById(req.params.id)
    .then((result) => res.json(result))
    .catch(next);
});

router.post('/desactivate', (req, res, next) => {
  const id = req.body.id;
  const updates = {
    isAvailable: false
  };

  Trip.findByIdAndUpdate(id, updates)
    .then((result) => res.json(result))
    .catch(next);
});

module.exports = router;
