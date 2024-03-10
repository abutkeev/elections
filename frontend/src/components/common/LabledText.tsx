import { FC } from 'react';
import { Stack, Typography, TypographyProps } from '@mui/material';

interface LabledTextProps extends TypographyProps {
  text?: string | number;
  label: string;
  labelSuffix?: string;
  variant?: TypographyProps['variant'];
}

const LabledText: FC<LabledTextProps> = ({ label, labelSuffix, text, variant = 'body1' }) => {
  return (
    <Stack direction='row' spacing={1} m={1}>
      <Typography variant={variant}>
        {label}
        {labelSuffix}
      </Typography>
      {text && <Typography variant={variant}>{text}</Typography>}
    </Stack>
  );
};

export default LabledText;
