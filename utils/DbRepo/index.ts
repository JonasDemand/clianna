import { Customer } from './customer';
import { Document } from './document';
import { Order } from './order';
import { User } from './user';

export class DbRepo {
  public static User = User;
  public static Order = Order;
  public static Customer = Customer;
  public static Document = Document;
}
