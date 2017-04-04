import {Users, UserDocument} from '../models/user';
import {UserDAL} from '../dal/userDAL';

export class UserController {
  private dal: UserDAL = new UserDAL();

  constructor() {
  }

  public findById(id : string) : Promise<UserDocument> {
    return this.dal.findById(id);
  }

  public loginWithPassport(req: any, email: string, password: string, done: any) : void {
    console.log("before looking for user in db, req.user: ", JSON.stringify(req.user));
    console.log("before looking for user in db, email: ", email);
    console.log("this, login?", JSON.stringify(this));
    this.dal.findByEmail(email)
      .then((user: UserDocument) => {
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
      })
      .catch((err: any) => {
        // If there are any error, return the error
        if (err) {
          console.log("looking for user in db error?, email: ",
            email, "error: ", JSON.stringify(err));
          return done(err);
        }
      });
  }

  public signUpWithPassport(req: any, email: string, password: string, done: any) : void {
    //TODO move the stuff about checking for exists user to dal?
    this.dal.findByEmail(email)
      .then((user) => {
        // check if the email already exists
        if (user) {
          console.log("user email already created, email: ", email);
          return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
        } else {
          this.dal.createUser(email, password)
            .then((user) => {
              return done(null, user);
            })
            .catch((err) => {
              return done(err);
            });
        }
      })
  }
}
