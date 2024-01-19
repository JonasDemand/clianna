import { EId } from '@customTypes/id';
import { EShowOrder } from '@customTypes/order';
import { Check, Close } from '@mui/icons-material';
import { GridColDef } from '@mui/x-data-grid';
import {
  Document,
  EOrderShippingType,
  EOrderTax,
  EOrderType,
  Order,
} from '@utils/api/generated/Api';
import { getCustomerLabel } from '@utils/customer';
import { formatDate } from '@utils/date';
import React from 'react';

import { mapColumns } from './table';

export const variableColumns: GridColDef<Order>[] = mapColumns([
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
    valueGetter: ({ row }) => (row.type ? OrderTypeLabels.get(row.type) : ''),
  },
  { field: 'comment', headerName: 'Kommentar', flex: 1 },
  {
    field: 'creationDate',
    headerName: 'Erstellungsdatum',
    flex: 1,
    renderCell: ({ row }) => formatDate(row.creationDate),
  },
  {
    field: 'dueDate',
    headerName: 'Fertigstellungsdatum',
    flex: 1,
    renderCell: ({ row }) => formatDate(row.dueDate),
  },
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
]);
export const columns: GridColDef<Order>[] = mapColumns([
  {
    field: 'pending',
    headerName: 'Ausstehend',
    width: 100,
    renderCell: ({ row }) => (row.pending ? <Check /> : <Close />),
  },
]);
export const defaultVariableColumns = variableColumns.slice(1, 3);

export const defaultOrder = (): Order => ({
  id: EId.Create,
  pending: true,
  shippingType: EOrderShippingType.Send,
  taxes: EOrderTax.Nineteen,
  price: 0,
  documents: new Array<Document>(),
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

export const OrderTypeLabels = new Map<EOrderType, string>([
  [EOrderType.Einlagen, 'Einlagen'],
  [EOrderType.Einlagenarbeiten, 'Einlagenarbeiten'],
  [EOrderType.Abrolloptimierung, 'Abrolloptimierung'],
  [EOrderType.Schuharbeiten, 'Schuharbeiten'],
  [EOrderType.Massschuhleisten, 'Maßschuhleisten'],
  [EOrderType.Massschuhe, 'Maßschuhe'],
  [EOrderType.Schuhbestellung, 'Schuhbestellung'],
  [EOrderType.Miscellaneous, 'Sonstiges'],
]);

export const OrderShippingTypeLabels = new Map<EOrderShippingType, string>([
  [EOrderShippingType.Send, 'Versand'],
  [EOrderShippingType.Collect, 'Abholung'],
  [EOrderShippingType.Visit, 'Hausbesuch'],
]);
