import { Customer } from './customer';
import { Order } from './order';
import { User } from './user';
export class DbRepo {
  private constructor(userId: number) {
    this.User = new User();
    this.Order = new Order(userId);
    this.Customer = new Customer(userId);
  }
  public User: User;
  public Order: Order;
  public Customer: Customer;
  public static Current: DbRepo;
  public static Init = (userId: number) =>
    (DbRepo.Current = new DbRepo(userId));
}
