import MuiTooltip from '@components/External/MuiTooltip';
import ReactHighlighter from '@components/External/ReactHighlighter';
import { Link } from '@mui/material';
import { FC } from 'react';

const isValidHttpUrl = (s: string) => {
  let url;
  try {
    url = new URL(s);
  } catch {
    return false;
  }
  return url.protocol === 'http:' || url.protocol === 'https:';
};

export type TableCellProps = {
  search: string;
  value: string;
};

const TableCell: FC<TableCellProps> = ({ search, value }) => {
  return (
    <MuiTooltip arrow title={value}>
      {isValidHttpUrl(value) ? (
        <Link target="_blank" href={value}>
          <ReactHighlighter
            searchWords={search.split(' ')}
            textToHighlight={value}
          />
        </Link>
      ) : (
        <ReactHighlighter
          searchWords={search.split(' ')}
          textToHighlight={value}
        />
      )}
    </MuiTooltip>
  );
};

export default TableCell;
