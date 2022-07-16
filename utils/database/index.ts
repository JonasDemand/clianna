import { User } from './user';
class Db {
  constructor() {
    this.User = new User();
  }
  public User: User;
}

export default new Db();
