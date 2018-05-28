const express = require('express');
const router = express.Router();

//Bring in Models
let Destination = require('../models/destinationModel');

//add Destination Load Form
router.get('/add', (req, res)=>{

  Destination.find({}, function(err, destination){
    if (err) {
      console.log(err);
    } else {
      res.render('admin/destination/destinationAdd', {
      destination: destination,
      });
    }
  });

});

//Add submit POST route
router.post('/add', (req, res)=>{

  // add country only
  let destination = new Destination();
  destination.country_name = req.body.country;
  destination.dest_lat = req.body.destLat;
  destination.dest_lng = req.body.destLng;


  destination.save(function(err){
    if(err){
      console.log(err);
      return;
    } else {
      req.flash('success', 'Destination Added');
      res.redirect('/admin/destination/add');
    }
  });


});


// push the array collection of Province

router.post('/add/province', (req, res)=>{
  let destination = {};

  destination.country_name = req.body.selectedCountry;
  destination.province_name = req.body.province;
  destination.prov_lat = req.body.prov_lat;
  destination.prov_lng = req.body.prov_lng;

  var item = {
    province_name: destination.province_name,
    prov_lat: destination.prov_lat,
    prov_lng: destination.prov_lng
  }


  Destination.findOneAndUpdate({country_name: destination.country_name},
    {$push: {province: item}},
    {safe: true, upsert: true},
    function(err, model) {
      if (err) {
        console.log(err);
      } else {
        req.flash('success', 'Province has been added!');
        res.redirect('/admin/destination/add');
      }
    }
  );


});

//Edit submit POST router
router.post('/edit/:id', (req, res)=>{

  let destination = {};
  destination.country_name = req.body.country;
  destination.dest_lat = req.body.destLat;
  destination.dest_lng = req.body.destLng;

  let query = {_id:req.params.id}

  Destination.update(query, destination, function(err){
    if(err){
      console.log(err);
      return;
    } else {
      req.flash('success', 'Destination Updated');
      res.redirect('/admin/destination/add');
    }
  });
});

//Edit for Province submit POST router
router.post('/edit/:id', (req, res)=>{

  let destination = {};
  destination.country_name = req.body.country;
  destination.dest_lat = req.body.destLat;
  destination.dest_lng = req.body.destLng;

  let query = {_id:req.params.id}

  Destination.update(query, destination, function(err){
    if(err){
      console.log(err);
      return;
    } else {
      req.flash('success', 'Destination Updated');
      res.redirect('/admin/destination/add');
    }
  });
});

// Destination Delete
router.delete('/add/:id', (req, res)=>{

  let query = {_id:req.params.id}

  Destination.remove(query, function(err){
    if(err){
      console.log(err);
    } else {
      req.flash('danger', 'Destination Deleted');
      res.send('Success');
    }
  });
});

router.delete('/add/province/:id', (req, res)=>{
  let query = {_id:req.params.id}

  Destination.update(
    { },
    {$pull: {province: query}},
    {safe: true, upsert: true},
    function(err, doc) {
        if(err){
        console.log(err);
        }else{
        //do stuff
        req.flash('danger', 'Province Deleted');
        res.redirect('/admin/destination/add');
        }
    }
  );
});

module.exports = router;
