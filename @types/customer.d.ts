import { Customer, Order } from '@prisma/client';

export interface ICustomerWithOrders extends Customer {
  oders: Order[];
  openOrders: number;
}

export type CustomerContextType = {
  customers: ICustomerWithOrders[];
  setCustomers: (customers: ICustomerWithOrders[]) => void;
  filteredCustomers: ICustomerWithOrders[];
  setFilteredCustomers: (customers: ICustomerWithOrders[]) => void;
  selected: ICustomerWithOrders | null;
  setSelected: (customer: ICustomerWithOrders | null) => void;
};
