import { GridColDef } from '@mui/x-data-grid';

import { ICustomerWithOrders } from './database/customer';

export type CustomerContextType = {
  customers: ICustomerWithOrders[];
  setCustomers: (customers: ICustomerWithOrders[]) => void;
  filteredCustomers: ICustomerWithOrders[];
  selected: ICustomerWithOrders | null;
  setSelected: (customer: ICustomerWithOrders | null) => void;
  showCustomers: ShowCustomer;
  setShowCustomers: (state: ShowCustomer) => void;
  activeColumns: GridColDef<ICustomerWithOrders>[];
  setActiveColumns: (activeColumns: GridColDef<ICustomerWithOrders>[]) => void;
  searchText: string;
  setSearchText: (text: string) => void;
};

export enum ShowCustomer {
  All,
  Active,
  Disabled,
}

export const ShowCustomerLabel = new Map<ShowCustomer, string>([
  [ShowCustomer.All, 'Alle'],
  [ShowCustomer.Active, 'Aktiv'],
  [ShowCustomer.Disabled, 'Deaktiviert'],
]);
