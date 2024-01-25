import { ColumnAction, getActionColumn } from '@consts/table';
import { usePaginationContext } from '@context/PaginationContext';
import { ContentCopy, Delete } from '@mui/icons-material';
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

type ColumnEvent<T extends GridValidRowModel> = (row: T) => void;
type MuiTableProps<T extends GridValidRowModel> = DataGridProps<T> & {
  header: ReactNode;
  onCopy?: ColumnEvent<T>;
  onDelete?: ColumnEvent<T>;
  customActions?: ColumnAction<T>[];
};

const MuiTable = <T extends GridValidRowModel>({
  header,
  onCopy,
  onDelete,
  customActions,
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

  const actionColumn = useMemo(() => {
    const actions: ColumnAction<T>[] = [];
    if (onDelete)
      actions.push({
        icon: <Delete />,
        tooltip: 'Löschen',
        onClick: onDelete,
      });
    if (onCopy)
      actions.push({
        icon: <ContentCopy />,
        tooltip: 'Kopieren',
        onClick: onCopy,
      });
    return getActionColumn(
      customActions ? actions.concat(customActions) : actions
    );
  }, [customActions, onCopy, onDelete]);

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
        columns={[actionColumn].concat(
          gridProps.columns.map<GridColDef<T>>((column) => ({
            renderCell: ({ value }) => (
              <TableCell search={searchText} value={value} />
            ),
            ...column,
          }))
        )}
      />
    </Box>
  );
};

export default MuiTable;
