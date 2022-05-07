import { Autocomplete, TextField, UseAutocompleteProps } from '@mui/material';
import { DataGrid, deDE, GridColDef } from '@mui/x-data-grid';
import {
  ChangeEvent,
  FunctionComponent,
  SyntheticEvent,
  useContext,
  useEffect,
  useState,
} from 'react';
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

const defaultColumns = [columns[1].headerName, columns[2].headerName];

const CustomersTable: FunctionComponent = () => {
  const { customers, filteredCustomers, setFilteredCustomers } = useContext(
    CustomerContext
  ) as CustomerContextType;
  const [activeColumns, setActiveColumns] = useState(defaultColumns);
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
  const changeActiveColumns = (
    _: SyntheticEvent<Element, Event>,
    value: (string | undefined)[]
  ) => setActiveColumns(value);
  return (
    <>
      <TextField
        sx={{ pb: 1, width: '100%', flex: '0 1 auto' }}
        label="Suche"
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          filter(e.currentTarget.value.toLowerCase())
        }
      />
      <Autocomplete
        sx={{ pb: 2 }}
        multiple
        options={columns.map((column) => column.headerName)}
        defaultValue={defaultColumns}
        onChange={changeActiveColumns}
        renderInput={(params) => <TextField {...params} label="Spalten" />}
      />
      <DataGrid
        sx={{ height: 'unset', flex: '1 1 auto' }}
        rows={filteredCustomers.map((customer) => ({
          ...customer,
          openOrders: customer.oders.filter((order) => order.pending).length,
        }))}
        columns={columns.filter((column) =>
          activeColumns.includes(column.headerName)
        )}
        localeText={deDE.components.MuiDataGrid.defaultProps.localeText}
        disableColumnMenu
      />
    </>
  );
};

export default CustomersTable;
