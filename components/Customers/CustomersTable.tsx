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
  GridInputSelectionModel,
  GridRowParams,
} from '@mui/x-data-grid';
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
import { columns } from '../../consts/customers';
import { CustomerContext } from '../../context/customerContext';

const CustomersTable: FunctionComponent = () => {
  const {
    searchText,
    filteredCustomers,
    selected,
    setSelected,
    setSearchText,
    setActiveColumns,
    setShowDisabled,
    showDisabled,
    activeColumns,
  } = useContext(CustomerContext) as CustomerContextType;

  const [selectionModel, setSelectionModel] = useState<GridInputSelectionModel>(
    []
  );

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
        selectionModel={selectionModel}
        onSelectionModelChange={(model) => {
          if (selected && model[0] === selected.id) {
            setSelected(null);
            setSelectionModel([]);
          } else {
            setSelected(
              filteredCustomers.find(
                (customer) => customer.id === model[0]
              ) as ICustomerWithOrders
            );
            setSelectionModel(model);
          }
        }}
        disableColumnMenu
      />
    </Box>
  );
};

export default CustomersTable;
