import { EShowCustomer } from '@customTypes/customer';
import { EId } from '@customTypes/id';
import { Check, Close } from '@mui/icons-material';
import { GridColDef } from '@mui/x-data-grid';
import {
  Customer,
  Document,
  ECustomerSalutation,
  Order,
} from '@utils/api/generated/GENERATED_Client';
import React from 'react';

export const variableColumns: GridColDef<Customer>[] = [
  { field: 'id', headerName: 'Kunden-ID', flex: 1 },
  { field: 'firstName', headerName: 'Vorname', flex: 1 },
  { field: 'lastName', headerName: 'Nachname', flex: 1 },
  { field: 'email', headerName: 'E-Mail', flex: 1 },
  { field: 'street', headerName: 'Straße', flex: 1 },
  { field: 'streetNumber', headerName: 'Hausnummer', flex: 1 },
  { field: 'city', headerName: 'Stadt', flex: 1 },
  { field: 'postalCode', headerName: 'Postleitzahl', flex: 1 },
  { field: 'phone', headerName: 'Festnetztelefon', flex: 1 },
  { field: 'mobile', headerName: 'Mobiltelefon', flex: 1 },
  { field: 'shoeSize', headerName: 'Schuhgröße', flex: 1 },
  {
    field: 'whatsApp',
    headerName: 'WhatsApp',
    flex: 1,
    renderCell: ({ row }) => (row.whatsApp ? <Check /> : <Close />),
  },
  {
    field: 'salutation',
    headerName: 'Anrede',
    flex: 1,
    valueGetter: ({ row }) =>
      row.salutation ? CustomerSalutationLabels.get(row.salutation) : '',
  },
  {
    field: 'orders',
    headerName: 'Offene Bestellungen',
    flex: 1,
    valueGetter: ({ row }) => row.orders?.filter((x) => x.pending).length ?? 0,
  },
];
export const columns: GridColDef<Customer>[] = [
  {
    field: 'disabled',
    headerName: 'Aktiv',
    width: 60,
    renderCell: ({ row }) => (row.disabled ? <Close /> : <Check />),
  },
];

export const defaultVariableColumns = variableColumns.slice(1, 3);

export const defaultCustomer = (): Customer =>
  Customer.fromJS({
    id: EId.Create,
    whatsApp: false,
    disabled: false,
    orders: new Array<Order>(),
    documents: new Array<Document>(),
  });

export const ShowCustomerLabels = new Map<EShowCustomer, string>([
  [EShowCustomer.All, 'Alle'],
  [EShowCustomer.Active, 'Aktiv'],
  [EShowCustomer.Disabled, 'Deaktiviert'],
]);

export const CustomerSalutationLabels = new Map<ECustomerSalutation, string>([
  [ECustomerSalutation.Mr, 'Herr'],
  [ECustomerSalutation.Mrs, 'Frau'],
  [ECustomerSalutation.Diverse, 'Divers'],
  [ECustomerSalutation.Company, 'Firma'],
]);
