import { GridColDef } from '@mui/x-data-grid';

export const columns: GridColDef[] = [
  { field: 'id', headerName: 'Auftragsnummer', flex: 1 },
  { field: 'customerId', headerName: 'Kundennummer', flex: 1 },
  { field: 'date', headerName: 'Datum', flex: 1 },
  { field: 'shop', headerName: 'Shop', flex: 1 },
  { field: 'brand', headerName: 'Marke', flex: 1 },
  { field: 'model', headerName: 'Modell', flex: 1 },
];

/*export const columnNames: Record<string, string> = {
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
};*/

export const defaultColumns = [columns[4].headerName, columns[5].headerName];
