import { GridColDef } from '@mui/x-data-grid';

import { ICustomerWithOrders } from './database/customer';

export type CustomerContextType = {
  customers: ICustomerWithOrders[];
  setCustomers: (customers: ICustomerWithOrders[]) => void;
  filteredCustomers: ICustomerWithOrders[];
  selected: ICustomerWithOrders | null;
  setSelected: (customer: ICustomerWithOrders | null) => void;
  showCustomers: ShowCustomers;
  setShowCustomers: (state: ShowCustomers) => void;
  activeColumns: GridColDef<ICustomerWithOrders>[];
  setActiveColumns: (activeColumns: GridColDef<ICustomerWithOrders>[]) => void;
  searchText: string;
  setSearchText: (text: string) => void;
};

export enum ShowCustomers {
  All,
  Active,
  Disabled,
}
