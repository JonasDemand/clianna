import { Grid } from '@mui/material';
import { Order } from '@prisma/client';
import React, { ChangeEvent, FC, SyntheticEvent, useContext } from 'react';

import {
  CustomerContextType,
  ICustomerWithOrders,
} from '../../../@types/database/customer';
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

const CustomersTableHeader: FC = () => {
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
  return <Grid></Grid>;
};

export default CustomersTableHeader;
