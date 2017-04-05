//import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt-nodejs';
import { Document, Schema, model } from 'mongoose';

export class User {
  email: string;
  password: string;

  constructor(data: { email: string, password: string }) {
    this.email = data.email
    this.password = data.password
  }

  public static createNew(email: string, password: string) {
    const hashed = this.generateHash(password);
    return new User({email, password: hashed});
  }

  private static generateHash(password: string): string {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
  }

  public validPassword(password: string): boolean {
    return bcrypt.compareSync(password, this.password);
  }
}
// no necessary to export the schema (keep it private to the module)
const schema = new Schema({
  email: {type:String, required: true},
  password: {type:String, required: true}
});
// register each method at schema
schema.method('validPassword', User.prototype.validPassword);

export interface UserDocument extends User, Document { }

export const Users = model<UserDocument>('User', schema);

/*
export interface IUser extends mongoose.Document {
  email: string;
  password: string;
};

const UserSchema = new mongoose.Schema({
  email: {type:String, required: true},
  password: {type:String, required: true}
});

UserSchema.method('generateHash', (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
})

// generating a hash
UserSchema.methods.generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

// checking if password is valid
UserSchema.methods.validPassword = (password) => {
    return bcrypt.compareSync(password, this.password);
};
//type UserType = IUser & mongoose.Document;
const User = mongoose.model<IUser>('User', UserSchema);
export default User;
*/
