import { Box } from '@mui/system';
import { DataGrid, DataGridProps, deDE } from '@mui/x-data-grid';
import React, { ReactNode } from 'react';

type TablePageProps<T> = {
  header: ReactNode;
  rows: T[];
  columns: DataGridProps['columns'];
  selectionModel: DataGridProps['selectionModel'];
  onSelectionModelChange: DataGridProps['onSelectionModelChange'];
  getRowClassName: DataGridProps['getRowClassName'];
};

const setPlaceholder = <T extends {}>(obj: T): T => {
  const copy = { ...obj };
  Object.keys(copy).forEach((rawKey) => {
    const key = rawKey as keyof T;
    if (copy[key] !== null && copy[key] !== '') return;
    copy[key] = '-' as any;
  });
  return copy;
};

const TablePage = <T extends {}>({
  header,
  rows,
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
        localeText={deDE.components.MuiDataGrid.defaultProps.localeText}
        rows={rows.map((x) => setPlaceholder<T>(x))}
        disableColumnMenu
        {...gridProps}
      />
    </Box>
  );
};

export default TablePage;
