import {
  Button,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Stack,
} from '@mui/material';
import ProgressButton, { ProgressButtonProps } from './ProgressButton';
import { useTranslation } from 'react-i18next';
import { SyntheticEvent } from 'react';
import useMobile from '@/hooks/useMobile';

interface CustomDialogProps {
  open: boolean;
  title: string;
  content: React.ReactNode;
  maxWidth?: DialogProps['maxWidth'];
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonProps?: Omit<ProgressButtonProps, 'onClick' | 'children'>;
  cancelButtonProps?: Omit<ButtonProps, 'onClick' | 'children'>;
  onConfirm?(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void | Promise<void>;
  onCancel?(e: SyntheticEvent<unknown>): void;
  close?(e: SyntheticEvent<unknown>): void;
  refreshing?: boolean;
  extraButtons?: React.ReactNode;
}

export class AbortOperation {}

const CustomDialog: React.FC<CustomDialogProps> = ({
  open,
  title,
  content,
  maxWidth = 'sm',
  confirmButtonText,
  cancelButtonText,
  confirmButtonProps,
  cancelButtonProps,
  onConfirm,
  onCancel,
  close,
  refreshing,
  extraButtons,
}) => {
  const { t } = useTranslation();
  const mobile = useMobile();

  const { variant: cancelButtonVariant, ...otherCancelButtonProps } = cancelButtonProps || {};
  const { variant: confirmButtonVariant, ...otherConfirmButtonProps } = confirmButtonProps || {};

  const handleCancel = (e: SyntheticEvent<unknown>) => {
    if (onCancel) {
      onCancel(e);
    }
    if (close) {
      close(e);
    }
  };

  const handleConfirm: ButtonProps['onClick'] = async e => {
    try {
      if (onConfirm) {
        await onConfirm(e);
      }
      if (close) {
        close(e);
      }
    } catch (e) {
      if (!(e instanceof AbortOperation)) throw e;
    }
  };

  const handleKeyDown: DialogProps['onKeyDown'] = e => {
    e.stopPropagation();
    if (e.code === 'Escape') {
      handleCancel(e);
    }
  };

  return (
    <Dialog open={open} maxWidth={maxWidth} fullWidth onClose={handleCancel} onKeyDown={handleKeyDown}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{content}</DialogContent>
      <DialogActions>
        <Stack direction={mobile ? 'column' : 'row'} spacing={1} flexGrow={1} justifyContent='flex-end' mx={1} mb={1}>
          {extraButtons}
          {(onCancel || close) && (
            <Button
              onClick={handleCancel}
              variant={cancelButtonVariant || 'outlined'}
              {...otherCancelButtonProps}
              fullWidth={mobile}
            >
              {cancelButtonText || (onConfirm || onCancel ? t('Cancel') : t('Close'))}
            </Button>
          )}
          {onConfirm && (
            <ProgressButton
              onClick={handleConfirm}
              variant={confirmButtonVariant || 'contained'}
              refreshing={refreshing}
              {...otherConfirmButtonProps}
              buttonProps={{ fullWidth: mobile, ...otherConfirmButtonProps.buttonProps }}
            >
              {confirmButtonText || t('Confirm')}
            </ProgressButton>
          )}
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default CustomDialog;
