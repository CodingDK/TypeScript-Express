import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import {json, urlencoded} from 'body-parser';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
//import flash = require('connect-flash');
import config from './config/config';

import { loginRouter } from './routes/loginRouter';
import { githubRouter } from './routes/githubRouter';
import HeroRouter from './routes/HeroRouter';
import PassportConfig from './config/PassportConfig';

import {IDatabase} from './config/IDatabase';
import {MongoDatabase} from './dal/MongoDatabase';


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
    const dbHandler: IDatabase = new MongoDatabase();
    // open connection to Database
    dbHandler.openConnection(config.db.development);
    // If the Node process ends, close the database connection
    process.on('SIGINT', dbHandler.closeConnectionEvent);
    process.on('SIGTERM', dbHandler.closeConnectionEvent);

    app.use(cors({ origin: /localhost:4200$/, credentials: true})); //
    app.use(logger('dev'));
    app.use(cookieParser('secretForAll'));
    app.use(json());
    app.use(urlencoded({ extended: true }));

    app.use(session({
        secret: 'ytunolossabes',
        saveUninitialized: true,
        resave: true
    }));
    PassportConfig.setup(app);
    //app.use(flash()); // use connect-flash for flash messages stored in session
  }

  // Configure API endpoints.
  private routes(): void {
    let app = this.express;
    //let router = express.Router();
    /*router.get('/', (req, res, next) => {
      res.sendFile(path.join(__dirname+'/../client/index.html'));
    });*/

    //app.use('/', router);
    app.use('/api/github', githubRouter);
    app.use('/api/login', loginRouter);
    app.use('/api/heroes', HeroRouter);
    //TODO better handling for angular routes, maybe use next line
    //app.use(express.static(path.join(__dirname, "/../client")));

  }

  // route middleware to make sure a user is logged in
  private isLoggedIn(req: any, res: any, next: any): void {
    // if user is authenticate in the session, carry on
    if (req.isAuthenticated()) {
      return next();
    }
    // in any other case, redirect to the home
    //res.redirect('/');
    res.send(401, { login: false, text: 'Your are not logged in!' });
  }

}

export default new Server().express;
