import { getActionColumn, GetActiveColumnProps } from '@consts/table';
import { Box } from '@mui/system';
import {
  DataGrid,
  DataGridProps,
  deDE,
  GridValidRowModel,
} from '@mui/x-data-grid';
import React, { ReactNode, useMemo } from 'react';

type TablePageProps<T extends GridValidRowModel> = DataGridProps<T> &
  GetActiveColumnProps<T> & {
    header: ReactNode;
  };

const TablePage = <T extends GridValidRowModel>({
  header,
  onCopy,
  onDelete,
  onEdit,
  ...gridProps
}: TablePageProps<T>) => {
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
          '.row-disabled': {
            bgcolor: 'action.disabled',
            opacity: 0.5,
          },
          '.MuiDataGrid-cell': {
            outline: 'none !important',
          },
        }}
        localeText={deDE.components.MuiDataGrid.defaultProps.localeText}
        disableColumnMenu
        disableSelectionOnClick
        {...gridProps}
        columns={gridProps.columns.concat(actionColumn)}
      />
    </Box>
  );
};

export default TablePage;
