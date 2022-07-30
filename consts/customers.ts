import { ICustomerWithOrders } from '@customTypes/database/customer';
import { GridColDef } from '@mui/x-data-grid';
import { Order } from '@prisma/client';

export const columns: GridColDef[] = [
  { field: 'id', headerName: 'Kundennummer', flex: 1 },
  { field: 'firstname', headerName: 'Vorname', flex: 1 },
  { field: 'lastname', headerName: 'Nachname', flex: 1 },
  { field: 'email', headerName: 'E-Mail', flex: 1 },
  { field: 'street', headerName: 'Straße', flex: 1 },
  { field: 'streetnumber', headerName: 'Hausnummer', flex: 1 },
  { field: 'city', headerName: 'Stadt', flex: 1 },
  { field: 'postalcode', headerName: 'Postleitzahl', flex: 1 },
  { field: 'phone', headerName: 'Telefon', flex: 1 },
  { field: 'shoesize', headerName: 'Schuhgröße', flex: 1 },
  { field: 'openOrders', headerName: 'Offene Bestellungen', flex: 1 },
];

export const columnNames: Record<string, string> = {
  id: 'Kundennummer',
  firstname: 'Vorname',
  lastname: 'Nachname',
  email: 'E-Mail',
  street: 'Straße',
  streetnumber: 'Hausnummer',
  city: 'Stadt',
  postalcode: 'Postleitzahl',
  phone: 'Telefon',
  shoesize: 'Schuhgröße',
  openOrders: 'Offene Bestellungen',
};

export const defaultColumns = [columns[1].headerName, columns[2].headerName];

export const defaultCustomer = (): ICustomerWithOrders => ({
  id: -1,
  firstname: '',
  lastname: '',
  email: null,
  street: null,
  streetnumber: null,
  city: null,
  postalcode: null,
  phone: null,
  shoesize: null,
  disabled: false,
  orders: new Array<Order>(),
  openOrders: 0,
});
