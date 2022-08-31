import { GridColDef } from '@mui/x-data-grid';

import { ICustomerWithOrders } from './database/customer';

export type CustomerContextType = {
  customers: ICustomerWithOrders[];
  setCustomers: (customers: ICustomerWithOrders[]) => void;
  filteredCustomers: ICustomerWithOrders[];
  selected: ICustomerWithOrders | null;
  setSelected: (customer: ICustomerWithOrders | null) => void;
  showCustomers: EShowCustomer;
  setShowCustomers: (state: EShowCustomer) => void;
  activeColumns: GridColDef<ICustomerWithOrders>[];
  activeVariableColumns: GridColDef<ICustomerWithOrders>[];
  setActiveVariableColumns: (
    activeColumns: GridColDef<ICustomerWithOrders>[]
  ) => void;
  searchText: string;
  setSearchText: (text: string) => void;
};

export enum EShowCustomer {
  All,
  Active,
  Disabled,
}
