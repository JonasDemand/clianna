import { Customer } from './customer';
import { Order } from './order';
import { User } from './user';
class Db {
  constructor() {
    this.User = new User();
    this.Order = new Order();
    this.Customer = new Customer();
  }
  public User: User;
  public Order: Order;
  public Customer: Customer;
}

const currentDb = new Db();

export { currentDb as Db };
