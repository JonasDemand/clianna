import { GridColDef } from '@mui/x-data-grid';
import { Customer, Document, Order } from '@utils/api/generated/Api';

export type OrderContextType = {
  customers: Customer[];
  templates: Document[];
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  selected: Order | null;
  setSelected: (order: Order | null) => void;
  updateSelected: <T extends keyof Order>(property: T, value: Order[T]) => void;
  showOrders: EShowOrder;
  setShowOrders: (state: EShowOrder) => void;
  activeColumns: GridColDef<Order>[];
  activeVariableColumns: GridColDef<Order>[];
  setActiveVariableColumns: (activeColumns: GridColDef<Order>[]) => void;
  filterCustomer: Customer | null;
  setFilterCustomer: (value: Customer | null) => void;
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
