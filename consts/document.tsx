import { IDocument } from '@customTypes/database/document';
import { GridColDef } from '@mui/x-data-grid';

export const columns: GridColDef<IDocument>[] = [
  { field: 'id', headerName: 'Dokumente-ID', flex: 1 },
  { field: 'name', headerName: 'Name', flex: 1 },
  {
    field: 'googleId',
    headerName: 'Dokument',
    flex: 1,
    valueGetter: ({ row }) =>
      `https://docs.google.com/document/d/${row.googleId}`,
  },
];
