const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const engine = require('ejs-locals');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport')
const config = require('./config/database');

class Main {
  constructor() {
    this.initDB();
    this.initViewEngine();
    this.initExpressMiddleware();
    this.initController();
    this.start();
  }

  start(){
    //Start Server
    app.listen(3000, ()=>
      console.log('Server started on port 3000 . . .'));
  }

  initViewEngine(){
    //Load View Engine
    app.set('views', path.join(__dirname, 'views'));
    app.engine('ejs', engine);
    app.set('view engine', 'ejs');
  }

  initExpressMiddleware(){
    //body parser Middleware
    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }));
    // parse application/json
    app.use(bodyParser.json());


    // Set Public Folder
    app.use(express.static(path.join(__dirname, '/public')));

    //Express Session Middleware
    /*associated with authentication when this involves the process verifying whether
    a user is who he declares to be or not, as well as if he/she has the privileges
    to access the requested resources.*/
    app.use(session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: true
    }));

    //Express Messages Middleware
    //For the message notification
    app.use(require('connect-flash')());
    app.use((req, res, next) =>{
      res.locals.messages = require('express-messages')(req, res);
      next();

    });

    // Express Validator Middleware
    /*app.use(expressValidator({
      errorFormatter: function(param, msg, value) {
          var namespace = param.split('.')
          , root    = namespace.shift()
          , formParam = root;

        while(namespace.length) {
          formParam += '[' + namespace.shift() + ']';
        }
        return {
          param : formParam,
          msg   : msg,
          value : value
        };
      }
    }));*/
    // Passport config
    require('./config/passport')(passport);
    // Passport Middleware
    app.use(passport.initialize());
    app.use(passport.session());

    //set global admin variable
    app.get('*', (req, res, next) =>{
      res.locals.admin = req.user || null;
      next()
    });
  }

  initController(){
    //Fire Controller
    let admin = require('./controllers/adminController');
    app.use('/admin', admin);
    let odtw = require('./controllers/odtwController');
    app.use('/admin/odtw', odtw);
    let destination = require('./controllers/destinationController');
    app.use('/admin/destination', destination);
    let index = require('./controllers/indexController');
    app.use('', index);

  }

  initDB(){
    //connect to mongodb
    mongoose.connect(config.database);
    let db = mongoose.connection;

    //check connection
    db.once('open', ()=>
      console.log('Connected to MongoDB'));

    //check for DB errors
    db.on('error', (err)=>
      console.log(err));

  }

}

new Main();
