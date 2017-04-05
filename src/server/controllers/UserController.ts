import {UserDocument} from '../models/user';
import {UserDAL} from '../dal/userDAL';

export class UserController {
  private dal: UserDAL = new UserDAL();

  constructor() {
  }

  public findById(id : string) : Promise<UserDocument> {
    return this.dal.findById(id);
  }

  public findByEmail(email : string) : Promise<UserDocument> {
    return this.dal.findByEmail(email);
  }

  public createUser(email:string, password: string) : Promise<UserDocument> {
    return this.dal.createUser(email, password);
  }
}
