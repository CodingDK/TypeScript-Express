

import {Application} from 'express';
import * as passport from "passport";
const LocalStrategy = require('passport-local').Strategy;
import {User, Users, UserDocument} from '../models/user';

export default class PassportConfig {

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
    passport.serializeUser(function(user : UserDocument, done) {
      console.log("serializeUser", JSON.stringify(user));
        done(null, user._id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        console.log("deserializeUser ID: ", JSON.stringify(id));
        Users.findById(id, function(err, user) {
            console.log("deserializeUser USER: ", JSON.stringify(user));
            done(err, user);
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
        (req, email, password, done) => {
            // async
            process.nextTick(() => {

                if(!req.user) {
                    // first we try to find the user to see if already exists
                    Users.findOne({'email': email}, (err, user) => {
                        // if error, return error
                        if (err) {
                            return done(err);
                        }

                        // check if the email already exists
                        if (user) {
                          console.log("user email already created, email: ", email);

                            return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                        } else {
                            // if there si no user, create a new one
                            const newUser = User.createNew(email, password);
                            console.log("before created", JSON.stringify(newUser));
                            // set the credentials
                            //newUser.email = email;
                            //newUser.password = newUser.generateHash(password);
                            // saving the user
                            Users.create(newUser, (err: any, createdUser: UserDocument) => {
                               if (err) {
                                   throw err;
                               }
                               console.log("after created", JSON.stringify(newUser));
                               console.log("after created doc", JSON.stringify(createdUser));
                               return done(null, createdUser);
                            })
                            /*newUser.save(function (err) {
                                if (err) {
                                    throw err;
                                }
                                return done(null, newUser);
                            });*/
                        }
                    });
                } else {
                    // If the user is already logged in, we add the credential into profile
                    /*var user = req.user;

                    // set the credentials
                    user.local.email = email;
                    user.local.password = user.generateHash(password);
                    // saving the user
                    user.save(function (err) {
                        if (err) {
                            throw err;
                        }
                        return done(null, user);
                    });
                    */
                    return done(null, req.user);
                }
            });
        })
    );

    // =========== //
    // LOCAL LOGIN //
    // =========== //
    // We create another strategy for the login process

    passport.use('local-login', new LocalStrategy({
            // change default username for email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        (req, email, password, done) => {
            // first check if the user already exists
            console.log("before looking for user in db, req.user: ", JSON.stringify(req.user));
            console.log("before looking for user in db, email: ", email);
            Users.findOne({'email': email}, (err, user) => {
                // If there are any error, return the error
                if (err) {
                    console.log("looking for user in db error?, email: ",
                      email, "error: ", JSON.stringify(err));
                    return done(err);
                }

                // if no user is found, return message
                if (!user) {
                  console.log("no user found with " + email);
                  return done(null, false, req.flash('loginMessage', 'No user found.'));
                }

                // if the user exists, we check the password
                if (!user.validPassword(password)) {
                  console.log("user password not valid, email: " + email);
                  return done(null, false, req.flash('loginMessage', 'Opps! Wrong password.'));
                }

                console.log("user logged in", JSON.stringify(user));
                // if everything is ok, return the user
                return done(null, user);
            });
        })
    );
    // passport setup
    this.app.use(passport.initialize());
    this.app.use(passport.session());
  }
}
