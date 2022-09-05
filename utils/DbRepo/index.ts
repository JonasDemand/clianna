import { Customer } from './customer';
import { Order } from './order';
import { User } from './user';

export class DbRepo {
  private constructor(userCuid: string) {
    this.User = new User();
    this.Order = new Order(userCuid);
    this.Customer = new Customer(userCuid);
  }
  public User: User;
  public Order: Order;
  public Customer: Customer;
  public static Instance: DbRepo;
  public static Init = (userCuid: string) =>
    (DbRepo.Instance = new DbRepo(userCuid));
}
DbRepo.Init('');
