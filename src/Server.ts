import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as passport from "passport";
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import * as mongoose from 'mongoose';
import flash = require('connect-flash');
import config from './config/config';

import HeroRouter from './routes/HeroRouter';
import PassportConfig from './config/PassportConfig';


// Creates and configures an ExpressJS web server.
class Server {

  // ref to Express instance
  public express: express.Application;

  //Run configuration methods on the Express instance.
  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
  }

  // Configure Express middleware.
  private middleware(): void {
    const app = this.express;
    // the url correspond to the environment we are in
    app.set('dbUrl', config.db['development']);
    // we're going to use mongoose to interact with the mongodb
    mongoose.connect(app.get('dbUrl'));
    app.use(logger('dev'));
    app.use(cookieParser('secretForAll'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(session({
        secret: 'ytunolossabes',
        saveUninitialized: true,
        resave: true
    }));
    PassportConfig.setup(app);
    app.use(flash()); // use connect-flash for flash messages stored in session
  }

  // Configure API endpoints.
  private routes(): void {
    let router = express.Router();

    router.get('/', (req, res, next) => {
      res.json({
        message: 'Hello World!'
      });
    });
    router.get('/locked', this.isLoggedIn, (req, res, next) => {
      res.json({
        message: 'This is not for all, just you! nice'
      });
    });

    /* GET &amp; POST for SIGNUP */
    router.get('/signup', function(req, res, next) {
        res.sendFile(path.join(__dirname+'/signup.html'));
        next();
    }, function (req, res, next) {
        console.log('Middleware next called on signup get');
    });

    router.post('/signup', passport.authenticate('local-signup',{
            successRedirect: 'locked',
            failureRedirect: 'signup',
            failureFlash: true
        })
    );

    /* GET &amp; POST for LOGIN */
    router.get('/login', function (req, res, next) {
        res.sendFile(path.join(__dirname+'/login.html'));
    });

    router.post('/login', passport.authenticate('local-login',{
            successRedirect: 'locked',
            failureRedirect: 'login',
            failureFlash: true
        })
    );

    /* LOGOUT */
    router.get('/logout', function(req, res, next) {
        req.logout();
        res.redirect('/');
    });



    //router.post('/login', passport.authenticate('local'));
    /*router.post('/login',
      passport.authenticate('local', { failureRedirect: '/login' }),
      function(req, res) {
        res.redirect('/');
      }
    );*/
    /*router.post('/login',
        function (req, res, next) {
            console.log("User.validate()");
            next();
        },
        passport.authenticate('local',{
                successRedirect: '/locked',
                failureRedirect: '/login',
                failureFlash : true
            }
        ));*/
    /*router.post('/login', passport.authenticate('local',{
        successRedirect: '/locked',
        failureRedirect: '/login',
        failureFlash: true
      })
    ,
  function(req, res) {
    res.redirect('/');
  });*/
    this.express.use('/', router);
    this.express.use('/api/v1/heroes', HeroRouter);
  }

  // route middleware to make sure a user is logged in
  private isLoggedIn(req, res, next) : void {
    // if user is authenticate in the session, carry on
    if(req.isAuthenticated()){
      return next();
    }
    // in any other case, redirect to the home
    res.redirect('/');
  }

}

export default new Server().express;
