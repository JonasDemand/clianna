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
  showOrders: ShowOrder;
  setShowOrders: (state: ShowOrder) => void;
  activeColumns: GridColDef<IOrderWithCustomer>[];
  setActiveColumns: (activeColumns: GridColDef<IOrderWithCustomer>[]) => void;
  searchText: string;
  setSearchText: (text: string) => void;
};

export enum ShowOrder {
  All,
  Pending,
  Done,
}

export const ShowOrderLabel = new Map<ShowOrder, string>([
  [ShowOrder.All, 'Alle'],
  [ShowOrder.Pending, 'Ausstehend'],
  [ShowOrder.Done, 'Erledigt'],
]);
