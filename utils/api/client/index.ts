import { Customer } from './customer';
import { Document } from './document';
import { Order } from './order';
import { User } from './user';

export class ApiClient {
  private constructor() {
    this.User = new User();
    this.Order = new Order();
    this.Customer = new Customer();
    this.Document = new Document();
  }
  public User: User;
  public Order: Order;
  public Customer: Customer;
  public Document: Document;
  public static Instance: ApiClient;
  public static Init = () => (ApiClient.Instance = new ApiClient());
}
ApiClient.Init();
