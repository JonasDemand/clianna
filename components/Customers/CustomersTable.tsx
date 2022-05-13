import { ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { DataGrid, deDE, GridRowParams } from '@mui/x-data-grid';
import { Order } from '@prisma/client';
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
import { columns } from '../../consts/customers';
import { CustomerContext } from '../../context/customerContext';

const CustomersTable: FunctionComponent = () => {
  const {
    searchText,
    filteredCustomers,
    showDisabled,
    activeColumns,
    selected,
    setSelected,
    setSearchText,
    setActiveColumns,
    setShowDisabled,
    setSelectedDisabled,
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
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        <TextField
          sx={{
            mr: 1,
          }}
          fullWidth
          type="search"
          label="Suche"
          value={searchText}
          onChange={changeSearchText}
        />
        <Button
          sx={{ ml: 1 }}
          variant="contained"
          onClick={() => {
            setSelected({
              id: 0,
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
            setSelectedDisabled(false);
          }}
        >
          Hinzufügen
        </Button>
      </Box>
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
          '.row-disabled': {
            bgcolor: 'action.disabled',
            opacity: 0.5,
          },
          '.MuiDataGrid-row': {
            cursor: 'pointer',
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
          params.row.disabled ? 'row-disabled' : ''
        }
        selectionModel={selected ? [selected.id] : []}
        onSelectionModelChange={(model) => {
          if (selected?.id === 0 && !model[0]) return;
          setSelectedDisabled(true);
          if (selected && model[0] === selected.id) {
            setSelected(null);
            return;
          }
          setSelected(
            filteredCustomers.find(
              (customer) => customer.id === model[0]
            ) as ICustomerWithOrders
          );
        }}
        disableColumnMenu
      />
    </Box>
  );
};

export default CustomersTable;
