import MuiTooltip from '@components/External/MuiTooltip';
import { IconButton } from '@mui/material';
import { GridColDef, GridValidRowModel } from '@mui/x-data-grid';
import React from 'react';

export type ColumnAction<T extends GridValidRowModel> = {
  tooltip: string;
  key?: string;
  disabled?: (row: T) => boolean;
  onClick?: (row: T) => void;
  icon: React.ReactNode | React.ReactNode[];
};

export const getActionColumn = <T extends GridValidRowModel>(
  actions: ColumnAction<T>[]
): GridColDef<T> => {
  let width = 20 + actions.length * 40;
  return {
    field: '',
    headerName: '',
    sortable: false,
    width,
    renderCell: ({ row }) => (
      <>
        {actions.map((action) => (
          <MuiTooltip title={action.tooltip} key={action.key ?? action.tooltip}>
            <IconButton
              disabled={action.disabled ? action.disabled(row) : false}
              onClick={(e) => {
                e.stopPropagation();
                action.onClick!(row);
              }}
            >
              {action.icon}
            </IconButton>
          </MuiTooltip>
        ))}
      </>
    ),
  };
};

export const mapColumns = <T extends GridValidRowModel>(
  cols: GridColDef<T>[]
): GridColDef<T>[] =>
  cols.map((col) => ({
    sortComparator: () => 0,
    ...col,
  }));
