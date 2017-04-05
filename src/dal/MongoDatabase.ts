import * as mongoose from 'mongoose';

import {IDatabase} from '../config/IDatabase';

export class MongoDatabase implements IDatabase {
  openConnection(connectionString: string) : void {
    mongoose.connect(connectionString);
  }

  closeConnectionEvent() : void {
    mongoose.connection.close(() => {
      console.log('Mongoose default connection disconnected through app termination');
      process.exit(0);
    });
  }
}
