import { Customer, Order } from '@prisma/client';

export interface ICustomerWithOrders extends Customer {
  oders: Order[];
}

export type CustomerContextType = {
  customers: ICustomerWithOrders[];
  selected: ICustomerWithOrders;
  filteredCustomers: ICustomerWithOrders[];
  searchText: string;
};
