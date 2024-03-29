import React, { FC, PropsWithChildren, ReactNode, useState } from 'react';
import { ButtonProps, Button, Tooltip, Box } from '@mui/material';
import useWaitRefreshing from '@/hooks/useWaitRefreshing';
import ProgressContainer from './ProgressContainer';

export interface ProgressButtonProps extends Pick<ButtonProps, 'disabled' | 'variant'> {
  iconButton?: boolean;
  tooltip?: ReactNode;
  progressSize?: number;
  progressColor?: string;
  inProgress?: boolean;
  refreshing?: boolean;
  onClick?(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> | void;
  firstAction?(): void;
  finalAction?(): void;
  buttonProps?: Omit<ButtonProps, 'onClick' | 'children' | 'disabled' | 'variant'>;
  fullWidth?: boolean;
}

const ProgressButton: FC<PropsWithChildren<ProgressButtonProps>> = ({
  disabled,
  variant = 'contained',
  iconButton,
  tooltip = '',
  children,
  progressSize = 24,
  progressColor,
  inProgress,
  refreshing,
  onClick,
  firstAction,
  finalAction,
  buttonProps,
  fullWidth,
}) => {
  const [processing, setProcessing] = useState(false);
  const setWaitRefreshing = useWaitRefreshing(refreshing, () => {
    setProcessing(false);
    if (finalAction) {
      finalAction();
    }
  });

  const handleClick: ButtonProps['onClick'] = async e => {
    if (firstAction) {
      firstAction();
    }

    if (onClick) {
      setProcessing(true);
      try {
        await onClick(e);
      } finally {
        setWaitRefreshing(true);
      }
    }
  };

  const { sx: ButtonSx } = buttonProps || {};

  return (
    <Tooltip title={tooltip}>
      <Box width={fullWidth ? '100%' : undefined}>
        <ProgressContainer
          inProgress={inProgress || processing}
          progressColor={progressColor}
          progressSize={progressSize}
          boxProps={{ sx: [!!fullWidth && { display: 'block' }] }}
        >
          <Button
            {...buttonProps}
            sx={[
              ...(Array.isArray(ButtonSx) ? ButtonSx : [ButtonSx]),
              iconButton && { minWidth: 0, p: 1, borderRadius: '50%' },
              fullWidth && { width: '100%' },
            ]}
            disabled={disabled || inProgress || processing}
            variant={iconButton ? 'text' : variant}
            onClick={handleClick}
          >
            {children}
          </Button>
        </ProgressContainer>
      </Box>
    </Tooltip>
  );
};

export default ProgressButton;
