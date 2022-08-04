import { IOrderWithCustomer, OrderType } from '@customTypes/database/order';
import { Check, Close } from '@mui/icons-material';
import { GridColDef } from '@mui/x-data-grid';

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
    valueGetter: ({ row: { customer } }) =>
      customer
        ? `${customer.id} ${
            customer.firstname || customer.lastname ? '-' : ''
          } ${customer.firstname} ${customer.lastname}`
        : '',
  },
  {
    field: 'type',
    headerName: 'Typ',
    flex: 1,
    valueGetter: ({ row: { type } }) => OrderType[type as OrderType],
  },
  { field: 'comment', headerName: 'Kommentar', flex: 1 },
  { field: 'price', headerName: 'Preis', flex: 1 },
  {
    field: 'taxes',
    headerName: 'MvSt.',
    flex: 1,
    valueGetter: ({ row }) => (row.taxes ? `${row.taxes}%` : ''),
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
