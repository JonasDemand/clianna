import { Tooltip, TooltipProps, Typography } from '@mui/material';
import { FC } from 'react';

const MuiTooltip: FC<TooltipProps> = (props) => (
  <Tooltip arrow title={<Typography variant="body2">{props.title}</Typography>}>
    {props.children}
  </Tooltip>
);

export default MuiTooltip;
