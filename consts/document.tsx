import { IDocumentWithDependencies } from '@customTypes/database/document';
import { EShowDocument } from '@customTypes/document';
import { Check, Close } from '@mui/icons-material';
import { GridColDef } from '@mui/x-data-grid';
import { getCustomerLabel } from '@utils/customer';

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
    field: 'customer/order',
    headerName: 'Referenz',
    flex: 1,
    valueGetter: ({ row }) =>
      row.customer
        ? `Kunde ${getCustomerLabel(row.customer)}`
        : row.order
        ? `Auftrag ${row.order.id}`
        : '',
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

export const formColumns = variableColumns.slice(0, 3);

export const ShowDocumentLabels = new Map<EShowDocument, string>([
  [EShowDocument.All, 'Alle'],
  [EShowDocument.Template, 'Template'],
  [EShowDocument.File, 'Datei'],
]);
