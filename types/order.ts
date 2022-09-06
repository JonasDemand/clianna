import { GridColDef } from '@mui/x-data-grid';

import { ICustomer } from './database/customer';
import { IOrderWithCustomer } from './database/order';

export type OrderContextType = {
  customers: ICustomer[];
  setCustomers: (customers: ICustomer[]) => void;
  orders: IOrderWithCustomer[];
  setOrders: (orders: IOrderWithCustomer[]) => void;
  filteredOrders: IOrderWithCustomer[];
  selected: IOrderWithCustomer | null;
  setSelected: (order: IOrderWithCustomer | null) => void;
  updateSelected: <T extends keyof IOrderWithCustomer>(
    property: T,
    value: IOrderWithCustomer[T]
  ) => void;
  showOrders: EShowOrder;
  setShowOrders: (state: EShowOrder) => void;
  activeColumns: GridColDef<IOrderWithCustomer>[];
  activeVariableColumns: GridColDef<IOrderWithCustomer>[];
  setActiveVariableColumns: (
    activeColumns: GridColDef<IOrderWithCustomer>[]
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
