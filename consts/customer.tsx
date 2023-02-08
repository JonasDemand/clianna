import { EShowCustomer } from '@customTypes/customer';
import { ICustomerWithDependencies } from '@customTypes/database/customer';
import { IDocument } from '@customTypes/database/document';
import { IOrder } from '@customTypes/database/order';
import { EId } from '@customTypes/id';
import { Check, Close } from '@mui/icons-material';
import { GridColDef } from '@mui/x-data-grid';
import React from 'react';

export const variableColumns: GridColDef<ICustomerWithDependencies>[] = [
  { field: 'id', headerName: 'Kunden-ID', flex: 1 },
  { field: 'firstname', headerName: 'Vorname', flex: 1 },
  { field: 'lastname', headerName: 'Nachname', flex: 1 },
  { field: 'email', headerName: 'E-Mail', flex: 1 },
  { field: 'street', headerName: 'Straße', flex: 1 },
  { field: 'streetnumber', headerName: 'Hausnummer', flex: 1 },
  { field: 'city', headerName: 'Stadt', flex: 1 },
  { field: 'postalcode', headerName: 'Postleitzahl', flex: 1 },
  { field: 'phone', headerName: 'Festnetztelefon', flex: 1 },
  { field: 'mobile', headerName: 'Mobiltelefon', flex: 1 },
  { field: 'shoesize', headerName: 'Schuhgröße', flex: 1 },
  { field: 'fibu', headerName: 'FiBu-ID', flex: 1 },
  {
    field: 'whatsapp',
    headerName: 'WhatsApp',
    flex: 1,
    renderCell: ({ row }) => (row.whatsapp ? <Check /> : <Close />),
  },
  {
    field: 'orders',
    headerName: 'Offene Bestellungen',
    flex: 1,
    valueGetter: ({ row }) => row.orders?.length ?? 0,
  },
];
export const columns: GridColDef<ICustomerWithDependencies>[] = [
  {
    field: 'disabled',
    headerName: 'Aktiv',
    width: 60,
    renderCell: ({ row }) => (row.disabled ? <Close /> : <Check />),
  },
];

export const defaultVariableColumns = variableColumns.slice(1, 3);

export const defaultCustomer = (): ICustomerWithDependencies => ({
  id: EId.Create,
  whatsapp: false,
  disabled: false,
  orders: new Array<IOrder>(),
  documents: new Array<IDocument>(),
});

export const ShowCustomerLabels = new Map<EShowCustomer, string>([
  [EShowCustomer.All, 'Alle'],
  [EShowCustomer.Active, 'Aktiv'],
  [EShowCustomer.Disabled, 'Deaktiviert'],
]);
