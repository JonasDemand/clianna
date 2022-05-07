import { TextField } from '@mui/material';
import { DataGrid, deDE, GridColDef } from '@mui/x-data-grid';
import { ChangeEvent, FunctionComponent, useContext } from 'react';
import { CustomerContextType } from '../../@types/customer';
import { CustomerContext } from '../../context/customerContext';

const columns: GridColDef[] = [
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

const CustomersTable: FunctionComponent = () => {
  const { customers, filteredCustomers, setFilteredCustomers } = useContext(
    CustomerContext
  ) as CustomerContextType;
  const filter = (text: string) => {
    setFilteredCustomers(
      customers.filter((customer) =>
        Object.keys(customer).some((key) =>
          //@ts-expect-error
          customer[key]?.toString().toLowerCase().includes(text.toLowerCase())
        )
      )
    );
  };
  return (
    <>
      <TextField
        sx={{ pb: 2, width: '100%', flex: '0 1 auto' }}
        label="Suche"
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          filter(e.currentTarget.value.toLowerCase())
        }
      />
      <DataGrid
        sx={{ height: 'unset', flex: '1 1 auto' }}
        rows={filteredCustomers.map((customer) => ({
          ...customer,
          openOrders: customer.oders.filter((order) => order.pending).length,
        }))}
        columns={columns}
        localeText={deDE.components.MuiDataGrid.defaultProps.localeText}
        disableColumnMenu
      />
    </>
  );
};

export default CustomersTable;
