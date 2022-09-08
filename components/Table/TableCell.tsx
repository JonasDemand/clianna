import MuiTooltip from '@components/External/MuiTooltip';
import ReactHighlighter from '@components/External/ReactHighlighter';
import { Typography } from '@mui/material';
import { FC } from 'react';

export type TableCellProps = {
  search: string;
  value: string;
};

const TableCell: FC<TableCellProps> = ({ search, value }) => {
  return (
    <MuiTooltip arrow title={value}>
      <Typography variant="body2">
        <ReactHighlighter
          searchWords={search.split(' ')}
          textToHighlight={value}
        />
      </Typography>
    </MuiTooltip>
  );
};

export default TableCell;
