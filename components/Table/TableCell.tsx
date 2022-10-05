import MuiTooltip from '@components/External/MuiTooltip';
import ReactHighlighter from '@components/External/ReactHighlighter';
import { Box, Link } from '@mui/material';
import React, { FC } from 'react';

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
      <Box component="span" sx={{ userSelect: 'text' }}>
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
      </Box>
    </MuiTooltip>
  );
};

export default TableCell;
