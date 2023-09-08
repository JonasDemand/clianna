import { getActionColumn, GetActiveColumnProps } from '@consts/table';
import { Box } from '@mui/system';
import {
  DataGrid,
  DataGridProps,
  deDE,
  GridColDef,
  GridValidRowModel,
} from '@mui/x-data-grid';
import React, { ReactNode, useMemo } from 'react';

import TableCell from '../Table/TableCell';

type MuiTableProps<T extends GridValidRowModel> = DataGridProps<T> &
  GetActiveColumnProps<T> & {
    header: ReactNode;
    searchText: string;
  };

const MuiTable = <T extends GridValidRowModel>({
  header,
  searchText,
  onCopy,
  onDelete,
  onEdit,
  ...gridProps
}: MuiTableProps<T>) => {
  const actionColumn = useMemo(
    () => getActionColumn({ onCopy, onDelete, onEdit }),
    [onCopy, onDelete, onEdit]
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexFlow: 'column',
        height: 1,
        width: 1,
      }}
    >
      <Box sx={{ mb: 2 }}>{header}</Box>
      <DataGrid<T>
        sx={{
          flex: '1 1 auto',
          userSelect: 'none',
          '.MuiDataGrid-cell': {
            outline: 'none !important',
          },
          '.MuiDataGrid-row': {
            cursor: gridProps ? 'pointer' : 'unset',
          },
        }}
        localeText={deDE.components.MuiDataGrid.defaultProps.localeText}
        disableColumnMenu
        disableSelectionOnClick
        {...gridProps}
        columns={gridProps.columns
          .map<GridColDef<T>>((column) => ({
            renderCell: ({ value }) => (
              <TableCell search={searchText} value={value} />
            ),
            ...column,
          }))
          .concat(actionColumn)}
      />
    </Box>
  );
};

export default MuiTable;