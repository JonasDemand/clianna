import { Customer, Order } from '@prisma/client';

export interface ICustomerWithOrders extends Customer {
  oders: Order[];
}

export type CustomerContextType = {
  customers: ICustomerWithOrders[];
  setCustomers: (customers: ICustomerWithOrders[]) => void;
  filteredCustomers: ICustomerWithOrders[];
  setFilteredCustomers: (customers: ICustomerWithOrders[]) => void;
  selected: ICustomerWithOrders | null;
  setSelected: (customer: ICustomerWithOrders | null) => void;
  searchText: string;
  setSearchText: (searchText: string) => void;
};
