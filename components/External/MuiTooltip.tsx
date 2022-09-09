import { Tooltip, TooltipProps, Typography } from '@mui/material';
import { FC, useCallback, useState } from 'react';

export type MuiTooltipProps = TooltipProps & {
  show?: boolean;
};

const MuiTooltip: FC<MuiTooltipProps> = ({ show = true, ...props }) => {
  const [open, setOpen] = useState(false);

  const onOpen = useCallback(() => setOpen(true), []);

  const onClose = useCallback(() => setOpen(false), []);

  return (
    <Tooltip
      arrow
      open={show && open}
      onOpen={onOpen}
      onClose={onClose}
      {...props}
      title={<Typography variant="body2">{props.title}</Typography>}
    >
      <Typography variant="body2" sx={{ display: 'inline-block' }}>
        {props.children}
      </Typography>
    </Tooltip>
  );
};

export default MuiTooltip;
