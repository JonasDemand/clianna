import { Customer } from './customer';
import { Document } from './document';
import { Order } from './order';
import { User } from './user';

export class DbRepo {
  private constructor(userId: string) {
    this.User = new User(userId);
    this.Order = new Order(userId);
    this.Customer = new Customer(userId);
    this.Document = new Document(userId);
  }
  public User: User;
  public Order: Order;
  public Customer: Customer;
  public Document: Document;
  public static Instance: DbRepo;
  public static Init = (userId: string) =>
    (DbRepo.Instance = new DbRepo(userId));
}
DbRepo.Init('');
