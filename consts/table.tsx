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
}: GetActiveColumnProps<T>): GridColDef<T> => ({
  field: '',
  headerName: '',
  sortable: false,
  width: 140,
  renderCell: ({ row }) => (
    <>
      <MuiTooltip title="Bearbeiten">
        <IconButton disabled={!onEdit} onClick={() => onEdit!(row)}>
          <Edit />
        </IconButton>
      </MuiTooltip>
      <MuiTooltip title="Kopieren">
        <IconButton disabled={!onCopy} onClick={() => onCopy!(row)}>
          <ContentCopy />
        </IconButton>
      </MuiTooltip>
      <MuiTooltip title="Löschen">
        <IconButton disabled={!onDelete} onClick={() => onDelete!(row)}>
          <Delete />
        </IconButton>
      </MuiTooltip>
    </>
  ),
});
