import { Box } from '@mui/system';
import { DataGrid, DataGridProps, deDE } from '@mui/x-data-grid';
import React, { ReactNode } from 'react';

type TablePageProps<T> = {
  header: ReactNode;
  rows: T[];
  columns: DataGridProps['columns'];
  selectionModel?: DataGridProps['selectionModel'];
  onSelectionModelChange?: DataGridProps['onSelectionModelChange'];
};

const TablePage = <T extends {}>({
  header,
  ...gridProps
}: TablePageProps<T>) => {
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
          '.MuiDataGrid-row': {
            cursor: 'pointer',
          },
          '.MuiDataGrid-cell': {
            outline: 'none !important',
          },
        }}
        localeText={deDE.components.MuiDataGrid.defaultProps.localeText}
        disableColumnMenu
        {...gridProps}
      />
    </Box>
  );
};

export default TablePage;
