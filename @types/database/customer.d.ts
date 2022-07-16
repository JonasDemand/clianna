import {Customer, Order} from '@prisma/client';

export interface ICustomerWithOrders extends Customer {
  orders: Order[];
  openOrders: number;
}

export type ICustomerWithOrdersKeys = keyof ICustomerWithOrders;

export type CustomerContextType = {
  customers: ICustomerWithOrders[];
  setCustomers: (customers: ICustomerWithOrders[]) => void;
  filteredCustomers: ICustomerWithOrders[];
  setFilteredCustomers: (customers: ICustomerWithOrders[]) => void;
  selected: ICustomerWithOrders | null;
  setSelected: (customer: ICustomerWithOrders | null) => void;
  selectedDisabled: boolean;
  setSelectedDisabled: (disabled: boolean) => void;
  showDisabled: boolean;
  setShowDisabled: (disabled: boolean) => void;
  activeColumns: (string | undefined)[];
  setActiveColumns: (activeColumns: (string | undefined)[]) => void;
  searchText: string;
  setSearchText: (activeColumns: string) => void;
};
