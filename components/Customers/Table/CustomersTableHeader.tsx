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
import { Order } from '@prisma/client';
import React, {
  ChangeEvent,
  FunctionComponent,
  SyntheticEvent,
  useContext,
} from 'react';

import {
  CustomerContextType,
  ICustomerWithOrders,
} from '../../../@types/database/customer';
import { columns } from '../../../consts/customers';
import { CustomerContext } from '../../../context/customerContext';

const defaultCustomer = (): ICustomerWithOrders => ({
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

const CustomersTableHeader: FunctionComponent = () => {
  const {
    searchText,
    showDisabled,
    activeColumns,
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
    <>
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
            setSelected(defaultCustomer());
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
              lang=""
            />
          </FormGroup>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default CustomersTableHeader;
