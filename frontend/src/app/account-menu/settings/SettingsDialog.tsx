import { FC } from 'react';
import CustomDialog from '@/components/common/CustomDialog';
import { MenuItem, Stack, TextField, TextFieldProps } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/store';
import { setThemeMode } from '@/store/features/theme';

interface SettingsDialogProps {
  open: boolean;
  close(): void;
}

const SettingsDialog: FC<SettingsDialogProps> = ({ open, close }) => {
  const { t, i18n } = useTranslation();
  const { language, changeLanguage } = i18n;
  const { mode } = useAppSelector(({ theme }) => theme);
  const dispatch = useAppDispatch();

  const handleThemeChange: TextFieldProps['onChange'] = ({ target: { value } }) => dispatch(setThemeMode(value));

  const handleLanguageChange: TextFieldProps['onChange'] = async ({ target: { value } }) => {
    changeLanguage(value);
  };

  const handleClose = () => {
    close();
  };

  return (
    <CustomDialog
      open={open}
      close={handleClose}
      title={t('Settings')}
      content={
        <Stack spacing={2} mt={1}>
          <TextField label={t('Language')} select required value={language} onChange={handleLanguageChange}>
            <MenuItem value='en'>{t('English')}</MenuItem>
            <MenuItem value='ru'>{t('Russian')}</MenuItem>
          </TextField>
          <TextField label={t('Theme')} select required value={mode} onChange={handleThemeChange}>
            <MenuItem value='auto'>{t('Autodetect')}</MenuItem>
            <MenuItem value='light'>{t('Light')}</MenuItem>
            <MenuItem value='dark'>{t('Dark')}</MenuItem>
          </TextField>
        </Stack>
      }
    />
  );
};

export default SettingsDialog;
