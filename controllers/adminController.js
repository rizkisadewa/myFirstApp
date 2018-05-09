
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//Bring in Models
let Admin = require('../models/adminModel');

// *** dashboard *** //
//dashboard router
router.get('/', ensureAuthenticated, function(req, res){
  res.render('admin/administrator/dashboard');
});


// *** data admin *** //
// ** admin data view router
router.get('/data', ensureAuthenticated, function(req, res){
  /*
  // *** Testing JSON *** //
  var admin = [
    {
      adminNo: "Admin 1",
      name: "Santika",
      username: "santika",
      password: "***",
      accessType: "super user"
    },
    {
      adminNo: "Admin 2",
      name: "Rizky Sadewa",
      username: "rizky.sadewa",
      password: "***",
      accessType: "admin"
    }
  ];
  res.render('admin/adminData', {
    admin: admin
  });
  */
  Admin.find({}, function(err, admins){
    if(err){
      console.log(err);
    } else {
      res.render('admin/administrator/adminData', {
        admins: admins
      });
    }
  });

});

// ** add admin data
// router
router.get('/add', ensureAuthenticated, function(req, res){
  res.render('admin/administrator/adminAdd');
});

//Add submit POST route
router.post('/add', function(req, res){

  let admin = new Admin();
  admin.adminNo = req.body.adminNo;
  admin.name = req.body.name;
  admin.username = req.body.username;
  admin.password = req.body.password;
  admin.accessType = req.body.accessType;

  admin.save(function(err){
    if(err){
      console.log(err);
      return;
    } else {
      req.flash('success', 'Admin Added');
      res.redirect('/admin/data');
    }
  });


});

// ** update admin
// router of load edit form
router.get('/edit/:id', ensureAuthenticated, function(req, res){
  Admin.findById(req.params.id, function(err, admin){
    res.render('admin/administrator/adminEdit',{
      //title: 'Edit Admin',
      admin: admin

    });

  });
});

//Update submit POST route
router.post('/edit/:id', function(req, res){

  let admin = {};
  admin.adminNo = req.body.adminNo;
  admin.name = req.body.name;
  admin.username = req.body.username;
  admin.password = req.body.password;
  admin.accessType = req.body.accessType;

  let query = {_id:req.params.id}

  Admin.update(query, admin, function(err){
    if(err){
      console.log(err);
      return;
    } else {
      req.flash('success', 'Admin Updated');
      res.redirect('/admin/data');
    }
  });

});

// Admin Delete
router.delete('/data/:id', function(req, res){
  let query = {_id:req.params.id}

  Admin.remove(query, function(err){
    if(err){
      console.log(err);
    }
    req.flash('danger', 'Admin Deleted');
    res.send('Success');

  });
});

// Admin Register
router.get('/register', function(req, res){
  res.render('admin/register');
});

//Register Process
router.post('/register', function(req, res){

  const adminNo = req.body.adminNo;
  const name = req.body.name;
  const username = req.body.username;
  const password = req.body.password;
  const accessType = req.body.accessType;

  let newUser = new Admin({
    adminNo: adminNo,
    name: name,
    username: username,
    password: password,
    accessType: accessType
  });

  //encrypted the Password
  bcrypt.genSalt(10, function(err, salt){
    bcrypt.hash(newUser.password, salt, function(err, hash){
      if(err){
        console.log(err);
      } else {
        newUser.password = hash;
        newUser.save(function(err){
          if(err){
            console.log(err);
            return;
          } else {
            req.flash('success', 'You are now registered and can log in');
            res.redirect('/admin/login');
          }
        });
      }
    });
  });


});

// Login Form
router.get('/login', function(req, res){
  res.render('admin/login');
});

// Login Process
router.post('/login', function(req, res, next){
  passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/admin/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/admin/login');
});

// Access Control
function ensureAuthenticated(req, res, next){
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash('danger', 'Please Login as an Admin');
    res.redirect('/admin/login');
  }
}

module.exports = router;
