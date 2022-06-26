import { FormLabel, Typography } from '@mui/material';
import { DataGrid, deDE } from '@mui/x-data-grid';
import React, { useContext } from 'react';

import { CustomerContextType } from '../../../@types/customer';
import { columns, defaultColumns } from '../../../consts/orders';
import { CustomerContext } from '../../../context/customerContext';

const CustomerOrders = () => {
  const { selected } = useContext(CustomerContext) as CustomerContextType;
  return (
    <FormLabel
      sx={{
        display: 'flex',
        flexFlow: 'column',
        height: 1,
        minHeight: '300px',
      }}
    >
      <Typography sx={{ mb: 1 }}>Aufträge</Typography>
      <DataGrid
        sx={{
          flex: '1 1 auto',
          pt: 1,
        }}
        rows={selected?.orders ?? []}
        columns={columns.filter((column) =>
          defaultColumns.includes(column.headerName)
        )}
        localeText={deDE.components.MuiDataGrid.defaultProps.localeText}
        disableColumnMenu
      />
    </FormLabel>
  );
};

export default CustomerOrders;
