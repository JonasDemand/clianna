import { IDocumentWithDependencies } from '@customTypes/database/document';
import { EShowDocument } from '@customTypes/document';
import { Check, Close } from '@mui/icons-material';
import { GridColDef } from '@mui/x-data-grid';
import { getCustomerLabel } from '@utils/customer';
import { formatDate } from '@utils/date';
import { getOrderLabel } from '@utils/order';
import React from 'react';

export const variableColumns: GridColDef<IDocumentWithDependencies>[] = [
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
    field: 'customer',
    headerName: 'Kunde',
    flex: 1,
    valueGetter: ({ row }) => getCustomerLabel(row.customer),
  },
  {
    field: 'order',
    headerName: 'Auftrag',
    flex: 1,
    valueGetter: ({ row }) => getOrderLabel(row.order),
  },
];
export const columns: GridColDef<IDocumentWithDependencies>[] = [
  {
    field: 'template',
    headerName: 'Template',
    width: 80,
    renderCell: ({ row }) => (row.template ? <Check /> : <Close />),
  },
];

export const defaultVariableColumns = variableColumns.slice(1, 4);

export const ShowDocumentLabels = new Map<EShowDocument, string>([
  [EShowDocument.All, 'Alle'],
  [EShowDocument.Template, 'Template'],
  [EShowDocument.File, 'Datei'],
]);
