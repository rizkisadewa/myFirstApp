const LocalStrategy = require('passport-local').Strategy;
const Admin = require('../models/adminModel');
const config = require('../config/database');
const bcrypt = require('bcryptjs');

//export into an module
module.exports = function(passport){
  //Local Strategy
  passport.use(new LocalStrategy(function(username, password, done){
    //Match username
    let query = {username: username};
    Admin.findOne(query, function(err, admins){
      if(err) throw err;
      if(!admins){
        return done(null, false, {message: 'No User Found'});
      }

      //Match password
      bcrypt.compare(password, admins.password, function(err, isMatch){
        if(err) throw err;
        if(isMatch){
          return done(null, admins);
        } else {
          return done(null, false, {message: 'Wrong Password'});
        }
      });
    });
  }));

  passport.serializeUser(function(admins, done) {
    done(null, admins.id);
  });

  passport.deserializeUser(function(id, done) {
    Admin.findById(id, function(err, admins) {
      done(err, admins);
    });
  });
}
