const express = require('express');
const router = express.Router();

//Bring in Models
let Odtw = require('../models/odtwModel');
let Destination = require('../models/destinationModel');

//home router
router.get('/', function(req, res){

  Odtw.find({}, function(err, odtw){
    Destination.find({}, function(err, destination){
      if(err){
        console.log(err);
      } else {
        res.render('index', {
          odtw: odtw,
          destination: destination
        });
      }
    });

  });

});

router.get('/TravelTo/:province', function(req, res){
  var destination_name = req.params.province;
  Odtw.find({province: req.params.province}, function(err, odtw){
    Destination.find({}, function(err, destination){
      if (err) {
        console.log(err);
      } else {

        res.render('travel', {
          odtw: odtw,
          destination: destination,
          destination_name: destination_name
        });
      }

    });
  });
});

module.exports = router;
