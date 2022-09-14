import { GridColDef } from '@mui/x-data-grid';

import { ICustomer } from './database/customer';
import { IOrderWithDependencies } from './database/order';

export type OrderContextType = {
  customers: ICustomer[];
  setCustomers: (customers: ICustomer[]) => void;
  orders: IOrderWithDependencies[];
  setOrders: (orders: IOrderWithDependencies[]) => void;
  filteredOrders: IOrderWithDependencies[];
  selected: IOrderWithDependencies | null;
  setSelected: (order: IOrderWithDependencies | null) => void;
  updateSelected: <T extends keyof IOrderWithDependencies>(
    property: T,
    value: IOrderWithDependencies[T]
  ) => void;
  showOrders: EShowOrder;
  setShowOrders: (state: EShowOrder) => void;
  activeColumns: GridColDef<IOrderWithDependencies>[];
  activeVariableColumns: GridColDef<IOrderWithDependencies>[];
  setActiveVariableColumns: (
    activeColumns: GridColDef<IOrderWithDependencies>[]
  ) => void;
  searchText: string;
  setSearchText: (text: string) => void;
};

export enum EShowOrder {
  All,
  Pending,
  Done,
}

export enum EOrderBrand {
  Asics = 'Asics',
  Brooks = 'Brooks',
  Baer = 'Bär',
  Clarks = 'Clarks',
  Ecco = 'Ecco',
  FinnComfort = 'Finn Comfort',
  Gabor = 'Gabor',
  Ganter = 'Ganter',
  Hartjes = 'Hartjes',
  Lowa = 'Lowa',
  Meindl = 'Meindl',
  NewBalance = 'New Balance',
  Nike = 'Nike',
  Puma = 'Puma',
  Solidus = 'Solidus',
  Wolky = 'Wolky',
  Hoka = 'Hoka',
}
