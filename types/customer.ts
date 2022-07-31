import { ICustomerWithOrders } from './database/customer';

export type CustomerContextType = {
  customers: ICustomerWithOrders[];
  setCustomers: (customers: ICustomerWithOrders[]) => void;
  filteredCustomers: ICustomerWithOrders[];
  selected: ICustomerWithOrders | null;
  setSelected: (customer: ICustomerWithOrders | null) => void;
  showCustomers: ShowCustomers;
  setShowCustomers: (state: ShowCustomers) => void;
  activeColumns: (string | undefined)[];
  setActiveColumns: (activeColumns: (string | undefined)[]) => void;
  searchText: string;
  setSearchText: (activeColumns: string) => void;
};

export enum ShowCustomers {
  All,
  Active,
  Disabled,
}
