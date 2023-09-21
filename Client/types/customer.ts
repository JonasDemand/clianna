import { GridColDef } from '@mui/x-data-grid';
import { Customer, Document } from '@utils/api/generated/Api';

export type CustomerContextType = {
  customers: Customer[];
  setCustomers: (customers: Customer[]) => void;
  filteredCustomers: Customer[];
  templates: Document[];
  selected: Customer | null;
  setSelected: (customer: Customer | null) => void;
  updateSelected: <T extends keyof Customer>(
    property: T,
    value: Customer[T]
  ) => void;
  showCustomers: EShowCustomer;
  setShowCustomers: (state: EShowCustomer) => void;
  activeColumns: GridColDef<Customer>[];
  activeVariableColumns: GridColDef<Customer>[];
  setActiveVariableColumns: (activeColumns: GridColDef<Customer>[]) => void;
  searchText: string;
  setSearchText: (text: string) => void;
};

export enum EShowCustomer {
  All,
  Active,
  Disabled,
}
