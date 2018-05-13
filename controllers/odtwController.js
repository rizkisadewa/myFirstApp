const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

//Bring in Models
let Odtw = require('../models/odtwModel');
let Destination = require('../models/destinationModel');

//view data of ODTW
router.get('/data/page-:page', function(req, res){
  var perPage = 5;
  var page = req.params.page || 1;

  // pagination
  Odtw.find({})
  .skip((perPage * page) - perPage)
  .limit(perPage)
  .exec(function(err, odtw){
    Odtw.count().exec(function(err, count){
      if(err){
        console.log(err);
      } else {
        res.render('admin/odtw/odtwData', {
          odtw: odtw,
          current: page,
          pages: Math.ceil(count / perPage)
        });
      }
    });
  });

  /*
  Odtw.find({}, function(err, odtw){
    if(err){
      console.log(err);
    } else {
      res.render('admin/odtw/odtwData', {
        odtw: odtw
      });
    }
  }); */
});

//**UPLOAD AN ODTW IMAGE PROFILE
// Set The Storage Engine
const storage = multer.diskStorage({

  filename: function(req, file, cb){
    cb(null, file.originalname);
  }
});

// Init Upload
const upload = multer({
  storage: storage,
  limits:{fileSize: 1000000}, // file size limitationm, will provoke error if more than assigned
  fileFilter: function(req, file, cb){
    checkFileType(file, cb); // method for check file type
  }
});

// Check File Type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}

const cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'jepun-putih',
  api_key: 574587554557831,
  api_secret: "Ry_FGHnbJSKR3n7p7Q8oAsK1KJA"
});

//add ODTW
router.get('/add', function(req, res){

  Destination.find({}, function(err, destination){
    if(err){
      console.log(err);
    } else {
      res.render('admin/odtw/odtwAdd', {
        destination: destination
      });
    }
  });

});

router.post('/add', upload.single('image') , function(req, res){

  cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
    if(err) {
        console.log(err);
        return res.redirect('/admin/odtw/add');
      }
      // add cloudinary url for the image to the odtw object under image property
      req.body.odtw.image = result.secure_url;
      // add image's public_id to odtw object
      req.body.odtw.image_id = result.public_id;

      Odtw.create(req.body.odtw, function(err, odtw){
        if(err){
          console.log(err);
          return;
        } else {
          req.flash('success', 'Spot Added');
          res.redirect('/admin/odtw/data');
        }
      });

  });

});

//edit data of ODTW
// router of load edit form
router.get('/edit/:id', function(req, res){

  Odtw.findById(req.params.id, function(err, odtw){
    res.render('admin/odtw/odtwEdit',{
      odtw: odtw

    });

  });
});


router.post("/edit/:id", upload.single('image'), function(req, res){
  // if a new file has been uploaded
  if(req.file){
    Odtw.findById(req.params.id, function(err, odtw){
      if(err){
        console.log(err);
        return;
      }
      // delete the file from cloudinary
      cloudinary.v2.uploader.destroy(odtw.image_id, function(err, result){
        if(err){
          console.log(err);
          return;
        }
        // upload a new one
        cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
          if(err){
            console.log(err);
            return;
          }

          // add cloudinary url for the image to the odtw object under image property
          req.body.odtw.image = result.secure_url;
          // add image's public_id to odtw object
          req.body.odtw.image_id = result.public_id;

          Odtw.findByIdAndUpdate(req.params.id, req.body.odtw, function(err){
            if(err){
              console.log(err);
              return;
            } else {
              req.flash('success', 'Spot Updated');
              res.redirect('/admin/odtw/data');
            }
          });
        });
      });
    });
  } else {
    Odtw.findByIdAndUpdate(req.params.id, req.body.odtw, function(err){
      if(err){
        console.log(err);
        return;
      } else {
        req.flash('success', 'Spot Updated');
        res.redirect('/admin/odtw/data');
      }
    });
  }
});

// Spot Delete
router.delete('/data/:id', function(req, res){
  let query = {_id:req.params.id}

  Odtw.findById(req.params.id, function(err, odtw){
    if(err){
      console.log(err);
    }
    // delete the file from cloudinary
    cloudinary.v2.uploader.destroy(odtw.image_id, function(err, result){
      if(err){
        console.log(err);
      }
      odtw.remove(query, function(err){
        if (err) {
          console.log(err);
        }
        req.flash('danger', 'Spot Deleted');
        res.send('Success');
      });

    });
  });



});

// router of data single odtws
router.get('/view/:id', function(req, res){

  Odtw.findById(req.params.id, function(err, odtw){
    res.render('admin/odtw/odtwView',{
      odtw: odtw
    });
  });
});

module.exports = router;
