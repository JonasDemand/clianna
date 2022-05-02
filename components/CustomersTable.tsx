import { Customer } from '@prisma/client';
import { DataGrid, deDE, GridColDef } from '@mui/x-data-grid';
import { FunctionComponent } from 'react';
import { Box } from '@mui/material';

type CustomersTableProps = {
  customers: Customer[];
};

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Kundennummer', flex: 1 },
  { field: 'firstname', headerName: 'Vorname', flex: 2 },
  { field: 'lastname', headerName: 'Nachname', flex: 2 },
  { field: 'email', headerName: 'E-Mail', flex: 2 },
  { field: 'street', headerName: 'Straße', flex: 2 },
  { field: 'streetnumber', headerName: 'Hausnummer', flex: 2 },
  { field: 'city', headerName: 'Stadt', flex: 2 },
  { field: 'postalcode', headerName: 'Postleitzahl', flex: 2 },
  { field: 'phone', headerName: 'Telefon', flex: 2 },
  { field: 'shoesize', headerName: 'Schuhgröße', flex: 2 },
];
const CustomersTable: FunctionComponent<CustomersTableProps> = ({
  customers,
}) => {
  return (
    <Box sx={{ width: '100%', height: 'calc(100vh - 81px)' }}>
      <DataGrid
        rows={customers.filter((customer) => !customer.disabled)}
        columns={columns}
        checkboxSelection
        localeText={deDE.components.MuiDataGrid.defaultProps.localeText}
      />
    </Box>
  );
};

export default CustomersTable;
