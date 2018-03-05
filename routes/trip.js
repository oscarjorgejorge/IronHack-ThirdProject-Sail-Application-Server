'use strict';

const express = require('express');
const router = express.Router();
const Trip = require('../models/trip');

router.post('/create', (req, res, next) => {
  const tripTitle = req.body.triptitle;
  const description = req.body.description;
  const image = req.body.image;

  // console.log(req);

  if (!tripTitle || !description) {
    return res.status(422).json({error: 'validation'});
  }

  Trip.findOne({tripTitle}, 'tripTitle')
    .then((tripExists) => {
      if (tripExists) {
        return res.status(422).json({error: 'this-trip-already-exits'});
      }

      const newTrip = new Trip({
        _creator: req.body.user._id,
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

module.exports = router;
