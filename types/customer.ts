import { GridColDef } from '@mui/x-data-grid';

import { ICustomerWithDependencies } from './database/customer';

export type CustomerContextType = {
  customers: ICustomerWithDependencies[];
  setCustomers: (customers: ICustomerWithDependencies[]) => void;
  filteredCustomers: ICustomerWithDependencies[];
  selected: ICustomerWithDependencies | null;
  setSelected: (customer: ICustomerWithDependencies | null) => void;
  updateSelected: <T extends keyof ICustomerWithDependencies>(
    property: T,
    value: ICustomerWithDependencies[T]
  ) => void;
  showCustomers: EShowCustomer;
  setShowCustomers: (state: EShowCustomer) => void;
  activeColumns: GridColDef<ICustomerWithDependencies>[];
  activeVariableColumns: GridColDef<ICustomerWithDependencies>[];
  setActiveVariableColumns: (
    activeColumns: GridColDef<ICustomerWithDependencies>[]
  ) => void;
  searchText: string;
  setSearchText: (text: string) => void;
};

export enum EShowCustomer {
  All,
  Active,
  Disabled,
}
