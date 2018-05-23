const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

class mengelolaAdmin {
  constructor() {
    this.importModel();
    this.memasukkanAdmin();
    this.mengubahAdmin();
    this.menghapusAdmin();
    this.melihatAdmin();
    this.startAdmin();
  }

  importModel(){
    //Bring in Models
    let Admin = require('../models/adminModel');
  }

  startAdmin(){
    // *** dashboard *** //
    //dashboard router
    router.get('/', ensureAuthenticated, (req, res)=>
      res.render('admin/administrator/dashboard'));
  }

  melihatAdmin(){
    // *** data admin *** //
    // ** admin data view router
    router.get('/data', ensureAuthenticated, (req, res) => {
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
      Admin.find({}, (err, admins)=>{
        if(err){
          console.log(err);
        } else {
          res.render('admin/administrator/adminData', {
            admins: admins
          });
        }
      });

    });
  }

  memasukkanAdmin(){

    // ** add admin data
    // router
    router.get('/add', ensureAuthenticated, (req, res)=>{
      checkValidasi();
      res.render('admin/administrator/adminAdd');
    });

    //Add submit POST route
    router.post('/add', (req, res)=>{

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

    // Admin Register
    router.get('/register', (req, res)=>
      res.render('admin/register'));

    //Register Process
    router.post('/register', (req, res)=>{

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
      bcrypt.genSalt(10, (err, salt)=>{
        bcrypt.hash(newUser.password, salt, (err, hash)=>{
          if(err){
            console.log(err);
          } else {
            newUser.password = hash;
            newUser.save((err)=>{
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

  }

  mengubahAdmin(){
    // ** update admin
    // router of load edit form
    router.get('/edit/:id', ensureAuthenticated, (req, res)=>{
      Admin.findById(req.params.id, function(err, admin){
        res.render('admin/administrator/adminEdit',{
          //title: 'Edit Admin',
          admin: admin

        });

      });
    });

    //Update submit POST route
    router.post('/edit/:id', (req, res)=>{

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
  }

  menghapusAdmin(){
    // Admin Delete
    router.delete('/data/:id', ensureAuthenticated, (req, res)=>{
      let query = {_id:req.params.id}

      Admin.remove(query, (err)=>{
        if(err){
          console.log(err);
        }
        req.flash('danger', 'Admin Deleted');
        res.send('Success');

      });
    });
  }

}

class checkValidasi {
  constructor() {
    this.login();
    this.logout();
    //this.checkValidasi();
  }

  login(){
    // Login Form
    router.get('/login', (req, res)=>{
      res.render('admin/login');
    });

    // Login Process
    router.post('/login', (req, res, next)=>{
      passport.authenticate('local', {
        successRedirect: '/admin',
        failureRedirect: '/admin/login',
        failureFlash: true
      })(req, res, next);
    });
  }

  logout(){
    // Logout
    router.get('/logout', (req, res)=>{
      req.logout();
      req.flash('success', 'You are logged out');
      res.redirect('/admin/login');
    });
  }

}

// Access Control
let ensureAuthenticated = function(req, res, next){
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash('danger', 'Please Login as an Admin');
    res.redirect('/admin/login');
  }
}

new mengelolaAdmin();

module.exports = router;
