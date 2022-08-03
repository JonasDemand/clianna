import { GridColDef } from '@mui/x-data-grid';
import { Customer } from '@prisma/client';

import { IOrderWithCustomer } from './database/order';

export type OrderContextType = {
  customers: Customer[];
  setCustomers: (customers: Customer[]) => void;
  orders: IOrderWithCustomer[];
  setOrders: (orders: IOrderWithCustomer[]) => void;
  filteredOrders: IOrderWithCustomer[];
  selected: IOrderWithCustomer | null;
  setSelected: (order: IOrderWithCustomer | null) => void;
  showOrders: ShowOrders;
  setShowOrders: (state: ShowOrders) => void;
  activeColumns: GridColDef<IOrderWithCustomer>[];
  setActiveColumns: (activeColumns: GridColDef<IOrderWithCustomer>[]) => void;
  searchText: string;
  setSearchText: (text: string) => void;
};

export enum ShowOrders {
  All,
  Pending,
  Done,
}
