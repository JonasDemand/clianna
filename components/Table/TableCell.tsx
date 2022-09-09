import MuiTooltip from '@components/External/MuiTooltip';
import ReactHighlighter from '@components/External/ReactHighlighter';
import { FC } from 'react';

export type TableCellProps = {
  search: string;
  value: string;
};

const TableCell: FC<TableCellProps> = ({ search, value }) => {
  return (
    <MuiTooltip arrow title={value}>
      <ReactHighlighter
        searchWords={search.split(' ')}
        textToHighlight={value}
      />
    </MuiTooltip>
  );
};

export default TableCell;
