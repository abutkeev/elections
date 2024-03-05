import { FC } from 'react';
import { Stack, Typography, TypographyProps } from '@mui/material';

interface LabledTextProps extends TypographyProps {
  text?: string;
  label: string;
  labelSuffix?: string;
}

const LabledText: FC<LabledTextProps> = ({ label, labelSuffix, text }) => {
  return (
    <Stack direction='row' spacing={1} m={1}>
      <Typography>
        {label}
        {labelSuffix}
      </Typography>
      {text && <Typography>{text}</Typography>}
    </Stack>
  );
};

export default LabledText;
