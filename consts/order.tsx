import { IOrderWithDependencies } from '@customTypes/database/order';
import { EShowOrder } from '@customTypes/order';
import { Check, Close } from '@mui/icons-material';
import { GridColDef } from '@mui/x-data-grid';
import {
  EOrderShippingType,
  EOrderSpecification,
  EOrderTax,
  EOrderType,
} from '@prisma/client';
import { getCustomerLabel } from '@utils/customer';

export const variableColumns: GridColDef<IOrderWithDependencies>[] = [
  { field: 'id', headerName: 'Auftrags-ID', flex: 1 },
  {
    field: 'customer',
    headerName: 'Kunde',
    flex: 1,

    valueGetter: ({ row }) => getCustomerLabel(row.customer),
  },
  {
    field: 'type',
    headerName: 'Typ',
    flex: 1,
    valueGetter: ({ row }) => (row.type ? EOrderType[row.type] : ''),
  },
  { field: 'comment', headerName: 'Kommentar', flex: 1 },
  {
    field: 'price',
    headerName: 'Preis',
    flex: 1,
    valueGetter: ({ row }) => (row.price ? `${row.price.toFixed(2)} €` : ''),
  },
  {
    field: 'shippingType',
    headerName: 'Versandtyp',
    flex: 1,
    valueGetter: ({ row }) =>
      row.shippingType ? OrderShippingTypeLabels.get(row.shippingType) : '',
  },
  {
    field: 'taxes',
    headerName: 'MvSt.',
    flex: 1,
    valueGetter: ({ row }) => (row.taxes ? OrderTaxLabels.get(row.taxes) : ''),
  },
];
export const columns: GridColDef<IOrderWithDependencies>[] = [
  {
    field: 'pending',
    headerName: 'Ausstehend',
    width: 100,
    renderCell: ({ row }) => (row.pending ? <Check /> : <Close />),
  },
];
export const defaultVariableColumns = variableColumns.slice(0, 3);

export const defaultOrder = (): IOrderWithDependencies => ({
  id: undefined,
  creationDate: undefined,
  article: null,
  brand: null,
  color: null,
  comment: null,
  dealer: null,
  dueDate: null,
  pending: true,
  price: null,
  size: null,
  specification: null,
  type: null,
  name: null,
  customer: null,
  shippingType: EOrderShippingType.Send,
  taxes: EOrderTax.Nineteen,
});

export const ShowOrderLabels = new Map<EShowOrder, string>([
  [EShowOrder.All, 'Alle'],
  [EShowOrder.Pending, 'Ausstehend'],
  [EShowOrder.Done, 'Erledigt'],
]);

export const OrderTaxLabels = new Map<EOrderTax, string>([
  [EOrderTax.Nineteen, '19%'],
  [EOrderTax.Seven, '7%'],
]);

export const OrderSpecificationLabels = new Map<EOrderSpecification, string>([
  [EOrderSpecification.Sport, 'Sport'],
  [EOrderSpecification.Business, 'Business'],
  [EOrderSpecification.Casual, 'Casual'],
  [EOrderSpecification.Workwear, 'Workwear'],
  [EOrderSpecification.Massschuhe, 'Maßschuhe'],
  [EOrderSpecification.SchuhleistenEinleisten, 'Schuhleisten einleisten'],
  [EOrderSpecification.Erstlieferung, 'Erstlieferung'],
  [EOrderSpecification.Nachlieferung, 'Nachlieferung'],
]);

export const OrderTypeLabels = new Map<EOrderType, string>([
  [EOrderType.Einlagen, 'Einlagen'],
  [EOrderType.Einlagenarbeiten, 'Einlagenarbeiten'],
  [EOrderType.Abrolloptimierung, 'Abrolloptimierung'],
  [EOrderType.Schuharbeiten, 'Schuharbeiten'],
  [EOrderType.Massschuhleisten, 'Massschuhleisten'],
  [EOrderType.Massschuhe, 'Massschuhe'],
  [EOrderType.Schuhbestellung, 'Schuhbestellung'],
  [EOrderType.Miscellaneous, 'Sonstiges'],
]);

export const OrderShippingTypeLabels = new Map<EOrderShippingType, string>([
  [EOrderShippingType.Send, 'Versand'],
  [EOrderShippingType.Collect, 'Abholung'],
  [EOrderShippingType.Visit, 'Hausbesuch'],
]);
