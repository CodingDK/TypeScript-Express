import {User, Users, UserDocument} from '../models/user';
//import DbError from '../Errors/DbError';

export class UserDAL {
  constructor() {

  }

  public findByEmail(email: string) : Promise<UserDocument> {
    return new Promise<UserDocument>((resolve, reject) => {
      Users.findOne({'email': email}, (err, userDoc) => {
        if (err) {
          reject(err);
        }
        resolve(userDoc);
      });
    });
  }

  public findById(id : string) : Promise<UserDocument> {
    return new Promise<UserDocument>((resolve, reject) => {
      Users.findById(id, (err, userDoc) => {
        if (err) {
          //TODO maybe better error handling
          reject(err);
          //throw new DbError(JSON.stringify(err));
        }
        resolve(userDoc);
      });
    });
  }

  public createUser(email: string, password: string) : Promise<UserDocument> {
    return new Promise<UserDocument>((resolve, reject) => {
      // if there no user, create a new one
      const newUser = User.createNew(email, password);
      console.log("before db created", JSON.stringify(newUser));

      // saving the user
      Users.create(newUser, (err: any, createdUser: UserDocument) => {
        if (err) {
          reject(err);
        }
        console.log("after created", JSON.stringify(newUser));
        console.log("after created doc", JSON.stringify(createdUser));
        resolve(createdUser);
      })
    });
  }
}
