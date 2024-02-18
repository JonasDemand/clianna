import { EShowMessage } from '@customTypes/message';
import { Check, Close } from '@mui/icons-material';
import { GridColDef } from '@mui/x-data-grid';
import { Message } from '@utils/api/generated/Api';
import { getCustomerLabel } from '@utils/customer';
import { formatDate } from '@utils/date';
import { getOrderLabel } from '@utils/order';
import React from 'react';

import { mapColumns } from './table';

export const variableColumns: GridColDef<Message>[] = mapColumns([
  { field: 'id', headerName: 'Dokumente-ID', flex: 1 },
  { field: 'name', headerName: 'Name', flex: 1 },
  {
    field: 'creationDate',
    headerName: 'Erstellungsdatum',
    flex: 1,
    renderCell: ({ row }) => formatDate(row.creationDate),
  },
  {
    field: 'subject',
    headerName: 'Betreff',
    flex: 1,
  },
  {
    field: 'body',
    headerName: 'Text',
    flex: 1,
  },
  {
    field: 'customer',
    headerName: 'Kunde',
    flex: 1,
    valueGetter: ({ row }) =>
      getCustomerLabel(row.customer ?? row.order?.customer),
  },
  {
    field: 'order',
    headerName: 'Auftrag',
    flex: 1,
    valueGetter: ({ row }) => getOrderLabel(row.order),
  },
]);
export const columns: GridColDef<Message>[] = mapColumns([
  {
    field: 'template',
    headerName: 'Template',
    width: 80,
    renderCell: ({ row }) => (row.template ? <Check /> : <Close />),
  },
]);

export const defaultVariableColumns = variableColumns.slice(1, 3);

export const ShowMessageLabels = new Map<EShowMessage, string>([
  [EShowMessage.All, 'Alle'],
  [EShowMessage.Template, 'Template'],
  [EShowMessage.File, 'Datei'],
]);
