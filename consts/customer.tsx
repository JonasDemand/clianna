import { EShowCustomer } from '@customTypes/customer';
import { ICustomerWithOrders } from '@customTypes/database/customer';
import { IOrder } from '@customTypes/database/order';
import { Check, Close } from '@mui/icons-material';
import { GridColDef } from '@mui/x-data-grid';

export const variableColumns: GridColDef<ICustomerWithOrders>[] = [
  { field: 'id', headerName: 'Kundennummer', flex: 1 },
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
    valueGetter: ({ row }) => row.orders.length,
  },
];
export const columns: GridColDef<ICustomerWithOrders>[] = [
  {
    field: 'disabled',
    headerName: 'Aktiv',
    width: 60,
    renderCell: ({ row }) => (row.disabled ? <Close /> : <Check />),
  },
];

export const defaultVariableColumns = variableColumns.slice(0, 3);

export const defaultCustomer = (): ICustomerWithOrders => ({
  id: -1,
  firstname: null,
  lastname: null,
  email: null,
  street: null,
  streetnumber: null,
  city: null,
  postalcode: null,
  phone: null,
  shoesize: null,
  mobile: null,
  whatsapp: false,
  disabled: false,
  orders: new Array<IOrder>(),
});

export const ShowCustomerLabels = new Map<EShowCustomer, string>([
  [EShowCustomer.All, 'Alle'],
  [EShowCustomer.Active, 'Aktiv'],
  [EShowCustomer.Disabled, 'Deaktiviert'],
]);
