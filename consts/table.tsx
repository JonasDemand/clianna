import MuiTooltip from '@components/External/MuiTooltip';
import { ContentCopy, Delete, Edit } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { GridColDef, GridValidRowModel } from '@mui/x-data-grid';
type ColumnEvent<T extends GridValidRowModel> = (row: T) => void;

export type GetActiveColumnProps<T extends GridValidRowModel> = {
  onEdit?: ColumnEvent<T>;
  onCopy?: ColumnEvent<T>;
  onDelete?: ColumnEvent<T>;
};

export const getActionColumn = <T extends GridValidRowModel>({
  onEdit,
  onCopy,
  onDelete,
}: GetActiveColumnProps<T>): GridColDef<T> => {
  let width = 20;
  if (onEdit) width += 40;
  if (onCopy) width += 40;
  if (onDelete) width += 40;
  return {
    field: '',
    headerName: '',
    sortable: false,
    width,
    renderCell: ({ row }) => (
      <>
        {onEdit && (
          <MuiTooltip title="Bearbeiten">
            <IconButton onClick={() => onEdit!(row)}>
              <Edit />
            </IconButton>
          </MuiTooltip>
        )}
        {onCopy && (
          <MuiTooltip title="Kopieren">
            <IconButton onClick={() => onCopy!(row)}>
              <ContentCopy />
            </IconButton>
          </MuiTooltip>
        )}
        {onDelete && (
          <MuiTooltip title="Löschen">
            <IconButton onClick={() => onDelete!(row)}>
              <Delete />
            </IconButton>
          </MuiTooltip>
        )}
      </>
    ),
  };
};
