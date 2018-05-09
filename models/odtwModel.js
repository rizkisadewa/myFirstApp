let mongoose = require('mongoose');

//odtw Schema
let odtwSchema = mongoose.Schema({

    odtw_name : {
      type: String,
      required: true
    },

    lat : {
      type: Number,
      required: true
    },

    lng : {
      type: Number,
      required: true
    },

    altitude : {
      type: Number,
      required: true
    },

    country : {
      type: String,
      required: true
    },

    province : {
      type: String,
      required: true
    },

    area : {
      type: String,
      required: true
    },

    description : {
      type: String,
      required: true
    },

    bck_story : {
      type: String,
      required: true
    },

    rating_visit : {
      type: Number,
      required: true
    },

    rating_cleaness : {
      type: Number,
      required: true
    },

    rating_money_value : {
      type: Number,
      required: true
    },

    local_guide : {
      type: String,
      required: true
    },

    info_center : {
      type: String,
      required: true
    },

    clinic : {
      type: String,
      required: true
    },

    litter_basket : {
      type: String,
      required: true
    },

    restaurant : {
      type: String,
      required: true
    },

    shopping_center : {
      type: String,
      required: true
    },

    lavatory : {
      type: String,
      required: true
    },

    image : {
      type: String,
      required: true
    },

    image_id : {
      type: String,
      required: true
    }

});

let Odtw = module.exports = mongoose.model('Odtw', odtwSchema);
