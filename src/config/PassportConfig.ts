import {Application} from 'express';
import * as passport from "passport";
const LocalStrategy = require('passport-local').Strategy;
import {User, Users, UserDocument} from '../models/user';
import {UserController} from '../controllers/UserController';

export default class PassportConfig {
  private ctrl: UserController = new UserController();

  constructor(private app: Application) {
    this.init();
  }

  public static setup(app: Application) {
    return new PassportConfig(app);
  }


  private init(): void {
    // ====================== //
    // passport session setup //
    // ====================== //
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser((user: UserDocument, done) => {
      console.log("serializeUser", JSON.stringify(user));
      done(null, user._id);
    });

    // used to deserialize the user
    passport.deserializeUser((id: string, done: any) => {
      console.log("deserializeUser ID: ", JSON.stringify(id));
      console.log("test, this?", JSON.stringify(this));
      this.ctrl.findById(id)
        .then((user) => {
          done(null, user);
        })
        .catch((err) => {
          done(err);
        });
    });

    // ============ //
    // LOCAL SIGNUP //
    // ============ //

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
      },
      (req: any, email: string, password: string, done: any) => {
        // async
        process.nextTick(() => {
          this.ctrl.signUpWithPassport(req, email, password, done);
        });
      })
    );

    // =========== //
    // LOCAL LOGIN //
    // =========== //
    // We create another strategy for the login process

    passport.use(new LocalStrategy({
        // change default username for email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
      },
      (req: any, email: string, password: string, done: any) => {
        this.ctrl.loginWithPassport(req, email, password, done);
      })
    );
    // passport setup
    this.app.use(passport.initialize());
    this.app.use(passport.session());
  }
}
