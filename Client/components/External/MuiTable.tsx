import { getActionColumn, GetActiveColumnProps } from '@consts/table';
import { usePaginationContext } from '@context/PaginationContext';
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
  };

const MuiTable = <T extends GridValidRowModel>({
  header,
  onCopy,
  onDelete,
  onEdit,
  ...gridProps
}: MuiTableProps<T>) => {
  const {
    currentPage,
    gridSortModel,
    rowCount,
    searchText,
    setCurrentPage,
    setGridSortModel,
  } = usePaginationContext();

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
          '.MuiTablePagination-actions': {
            pointerEvents: 'none', //TODO: implement pagination
          },
        }}
        localeText={deDE.components.MuiDataGrid.defaultProps.localeText}
        rowsPerPageOptions={[100]}
        disableColumnMenu
        disableSelectionOnClick
        sortModel={gridSortModel}
        onSortModelChange={(model) => setGridSortModel(model)}
        page={currentPage}
        onPageChange={(page) => setCurrentPage(page)}
        rowCount={rowCount}
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
