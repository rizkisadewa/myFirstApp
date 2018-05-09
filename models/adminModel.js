let mongoose = require('mongoose');

//admin schema
let adminSchema = mongoose.Schema({

    adminNo:{
      type: String,
      required: true
    },
    name:{
      type: String,
      required: true
    },
    username:{
      type: String,
      required: true
    },
    password:{
      type: String,
      required: true
    },
    accessType:{
      type: String,
      required: true
    }

});

let Admin = module.exports = mongoose.model('Admin', adminSchema);
