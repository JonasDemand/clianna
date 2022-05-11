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
import {
  DataGrid,
  deDE,
  GridCellParams,
  GridColDef,
  GridRowParams,
} from '@mui/x-data-grid';
import debounce from 'lodash.debounce';
import {
  ChangeEvent,
  FunctionComponent,
  SyntheticEvent,
  useContext,
} from 'react';
import {
  CustomerContextType,
  ICustomerWithOrders,
} from '../../@types/customer';
import { columns, defaultColumns } from '../../consts/customers';
import { CustomerContext } from '../../context/customerContext';

const CustomersTable: FunctionComponent = () => {
  const {
    searchText,
    filteredCustomers,
    setSelected,
    setSearchText,
    setActiveColumns,
    setShowDisabled,
    showDisabled,
    activeColumns,
  } = useContext(CustomerContext) as CustomerContextType;

  const changeSearchText = (e: ChangeEvent<HTMLInputElement>) =>
    setSearchText(e.target.value);

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
      <TextField
        fullWidth
        type="search"
        label="Suche"
        value={searchText}
        onChange={changeSearchText}
      />
      <Accordion sx={{ mb: 2, mt: 1, borderRadius: 1, borderTop: 'none' }}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Erweiterte Optionen</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup sx={{ borderTop: 1, borderColor: 'primary.dark' }}>
            <FormControlLabel
              sx={{ pb: 2 }}
              control={<Checkbox checked={showDisabled} />}
              label="Deaktivierte anzeigen"
              onChange={changeShowDisabled}
            />
            <Autocomplete
              multiple
              options={columns.map((column) => column.headerName)}
              value={activeColumns}
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
          showDisabled ? true : !customer.disabled
        )}
        columns={columns.filter((column) =>
          activeColumns.includes(column.headerName)
        )}
        localeText={deDE.components.MuiDataGrid.defaultProps.localeText}
        getRowClassName={(params: GridRowParams<ICustomerWithOrders>) =>
          params.row.disabled ? 'grid-row-disabled' : 'grid-row'
        }
        onCellClick={(params: GridCellParams<any, ICustomerWithOrders>) =>
          setSelected(params.row)
        }
        disableColumnMenu
      />
    </Box>
  );
};

export default CustomersTable;
