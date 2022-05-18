import { Box } from '@mui/system';
import { DataGrid, deDE, GridRowParams } from '@mui/x-data-grid';
import {
  ChangeEvent,
  FunctionComponent,
  SyntheticEvent,
  useContext,
} from 'react';
import {
  CustomerContextType,
  ICustomerWithOrders,
} from '../../../@types/customer';
import { columns } from '../../../consts/customers';
import { CustomerContext } from '../../../context/customerContext';
import CustomersTableHeader from './CustomersTableHeader';

const CustomersTable: FunctionComponent = () => {
  const {
    filteredCustomers,
    showDisabled,
    activeColumns,
    selected,
    setSelected,
    setSelectedDisabled,
  } = useContext(CustomerContext) as CustomerContextType;

  return (
    <Box
      sx={{
        display: 'flex',
        flexFlow: 'column',
        height: 1,
      }}
    >
      <CustomersTableHeader />
      <DataGrid
        sx={{
          flex: '1 1 auto',
          userSelect: 'none',
          '.row-disabled': {
            bgcolor: 'action.disabled',
            opacity: 0.5,
          },
          '.MuiDataGrid-row': {
            cursor: 'pointer',
          },
          '.MuiDataGrid-cell': {
            outline: 'none !important',
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
