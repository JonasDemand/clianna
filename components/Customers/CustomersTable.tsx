import { ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { DataGrid, deDE, GridColDef, GridRowParams } from '@mui/x-data-grid';
import debounce from 'lodash.debounce';
import {
  ChangeEvent,
  FunctionComponent,
  SyntheticEvent,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  CustomerContextType,
  ICustomerWithOrders,
} from '../../@types/customer';
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

const columnNames: Record<string, string> = {
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

const defaultColumns = [columns[1].headerName, columns[2].headerName];

const CustomersTable: FunctionComponent = () => {
  const { customers, filteredCustomers, setFilteredCustomers } = useContext(
    CustomerContext
  ) as CustomerContextType;

  const [showDisabled, setShowDisabled] = useState(false);
  const [activeColumns, setActiveColumns] = useState(defaultColumns);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    setFilteredCustomers(
      customers.filter((customer) =>
        Object.keys(customer).some((key) => {
          if (activeColumns.includes(columnNames[key]))
            //@ts-expect-error
            return customer[key]
              ?.toString()
              .toLowerCase()
              .match(`.*${searchText.replace(' ', '.*')}.*`);
        })
      )
    );
  }, [activeColumns, customers, searchText, setFilteredCustomers]);

  const changeSearchText = debounce(
    (e: ChangeEvent<HTMLInputElement>) =>
      setSearchText(e.target.value.toLowerCase()),
    100
  );

  const changeActiveColumns = (
    _: SyntheticEvent<Element, Event>,
    value: (string | undefined)[]
  ) => setActiveColumns(value);

  const changeShowDisabled = (
    _: SyntheticEvent<Element, Event>,
    value: boolean
  ) => setShowDisabled(value);
  return (
    <Box
      sx={{
        display: 'flex',
        flexFlow: 'column',
        height: 1,
      }}
    >
      <TextField fullWidth label="Suche" onChange={changeSearchText} />
      <Accordion sx={{ mb: 2, mt: 1, borderRadius: '4px', borderTop: 'none' }}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Erweiterte Optionen</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup sx={{ borderTop: 1, borderColor: 'primary.dark' }}>
            <FormControlLabel
              sx={{ pb: 2 }}
              control={<Checkbox />}
              label="Deaktivierte anzeigen"
              onChange={changeShowDisabled}
            />
            <Autocomplete
              multiple
              options={columns.map((column) => column.headerName)}
              defaultValue={defaultColumns}
              onChange={changeActiveColumns}
              renderInput={(params) => (
                <TextField {...params} label="Spalten" />
              )}
            />
          </FormGroup>
        </AccordionDetails>
      </Accordion>
      <DataGrid
        sx={{
          flex: '1 1 auto',
          '.grid-row-disabled': {
            bgcolor: 'action.disabled',
            opacity: 0.5,
          },
        }}
        rows={filteredCustomers.filter((customer) =>
          showDisabled ? true : customer.disabled
        )}
        columns={columns.filter((column) =>
          activeColumns.includes(column.headerName)
        )}
        localeText={deDE.components.MuiDataGrid.defaultProps.localeText}
        getRowClassName={(params: GridRowParams<ICustomerWithOrders>) =>
          params.row.disabled ? 'grid-row' : 'grid-row-disabled'
        }
        disableColumnMenu
      />
    </Box>
  );
};

export default CustomersTable;
