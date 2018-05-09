let mongoose = require('mongoose');

const provinceSchema = mongoose.Schema({
  province_name:{
    type: String
  },
  prov_lat: Number,
  prov_lng: Number
});

//destination schema
const destinationSchema = mongoose.Schema({

  country_name:{
    type: String,
    required: true
  },

  province:[
    provinceSchema
  ],

  dest_lat:{
    type: Number,
    required: true
  },

  dest_lng:{
    type: Number,
    required: true
  }

});

let Destination = module.exports = mongoose.model('Destination', destinationSchema);
