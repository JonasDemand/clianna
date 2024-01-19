import { EShowDocument } from '@customTypes/document';
import { Check, Close } from '@mui/icons-material';
import { GridColDef } from '@mui/x-data-grid';
import { Document } from '@utils/api/generated/Api';
import { getCustomerLabel } from '@utils/customer';
import { formatDate } from '@utils/date';
import { getOrderLabel } from '@utils/order';
import React from 'react';

import { mapColumns } from './table';

export const variableColumns: GridColDef<Document>[] = mapColumns([
  { field: 'id', headerName: 'Dokumente-ID', flex: 1 },
  { field: 'name', headerName: 'Name', flex: 1 },
  {
    field: 'googleId',
    headerName: 'Google-Docs',
    flex: 1,
    valueGetter: ({ row }) =>
      `https://docs.google.com/document/d/${row.googleId}`,
  },
  {
    field: 'creationDate',
    headerName: 'Erstellungsdatum',
    flex: 1,
    renderCell: ({ row }) => formatDate(row.creationDate),
  },
  {
    field: 'incrementalId',
    headerName: 'Inkrementelle ID',
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
export const columns: GridColDef<Document>[] = mapColumns([
  {
    field: 'template',
    headerName: 'Template',
    width: 80,
    renderCell: ({ row }) => (row.template ? <Check /> : <Close />),
  },
]);

export const defaultVariableColumns = variableColumns.slice(1, 4);

export const ShowDocumentLabels = new Map<EShowDocument, string>([
  [EShowDocument.All, 'Alle'],
  [EShowDocument.Template, 'Template'],
  [EShowDocument.File, 'Datei'],
]);
