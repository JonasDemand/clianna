import {
  EOrderSpecification,
  EOrderType,
  EShippingType,
  ETax,
  IOrderWithCustomer,
} from '@customTypes/database/order';
import { EShowOrder } from '@customTypes/order';
import { Check, Close } from '@mui/icons-material';
import { GridColDef } from '@mui/x-data-grid';
import { getCustomerDisplay } from '@utils/customer';

export const columns: GridColDef<IOrderWithCustomer>[] = [
  {
    field: 'pending',
    headerName: 'Ausstehend',
    width: 100,
    renderCell: ({ row }) => (row.pending ? <Check /> : <Close />),
  },
  { field: 'id', headerName: 'Auftragsnummer', flex: 1 },
  {
    field: 'customerId',
    headerName: 'Kunde',
    flex: 1,
    valueGetter: ({ row }) => getCustomerDisplay(row.customer),
  },
  {
    field: 'type',
    headerName: 'Typ',
    flex: 1,
    valueGetter: ({ row }) => EOrderType[row.type as EOrderType],
  },
  { field: 'comment', headerName: 'Kommentar', flex: 1 },
  { field: 'price', headerName: 'Preis', flex: 1 },
  {
    field: 'shippingType',
    headerName: 'Versandtyp',
    flex: 1,
    valueGetter: ({ row }) =>
      row.shippingType !== null ? ShippingTypeLabels.get(row.shippingType) : '',
  },
  {
    field: 'taxes',
    headerName: 'MvSt.',
    flex: 1,
    valueGetter: ({ row }) =>
      row.taxes !== null ? TaxLabels.get(row.taxes) : '',
  },
];
export const defaultColumns = columns.slice(0, 4);

export const defaultOrder = (): IOrderWithCustomer => ({
  id: -1,
  customerId: null,
  article: null,
  brand: null,
  color: null,
  comment: null,
  creationDate: null,
  customer: null,
  dealer: null,
  dueDate: null,
  pending: null,
  price: null,
  shippingType: null,
  size: null,
  specification: null,
  taxes: null,
  type: null,
});

export const ShowOrderLabels = new Map<EShowOrder, string>([
  [EShowOrder.All, 'Alle'],
  [EShowOrder.Pending, 'Ausstehend'],
  [EShowOrder.Done, 'Erledigt'],
]);

export const TaxLabels = new Map<ETax, string>([
  [ETax.Nineteen, '19%'],
  [ETax.Seven, '7%'],
]);

export const OrderSpecificationLabels = new Map<EOrderSpecification, string>([
  [EOrderSpecification.Sport, 'Sport'],
  [EOrderSpecification.Business, 'Business'],
  [EOrderSpecification.Casual, 'Casual'],
  [EOrderSpecification.Workwear, 'Workwear'],
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

export const ShippingTypeLabels = new Map<EShippingType, string>([
  [EShippingType.Send, 'Versand'],
  [EShippingType.Collect, 'Abholung'],
  [EShippingType.Visit, 'Hausbesuch'],
]);
