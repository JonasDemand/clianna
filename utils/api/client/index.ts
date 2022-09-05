import { Customer } from './customer';
import { Order } from './order';
import { User } from './user';

export class ApiClient {
  private constructor() {
    this.User = new User();
    this.Order = new Order();
    this.Customer = new Customer();
  }
  public User: User;
  public Order: Order;
  public Customer: Customer;
  public static Instance: ApiClient;
  public static Init = () => (ApiClient.Instance = new ApiClient());
}
ApiClient.Init();
