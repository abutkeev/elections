import { Box, Paper } from '@mui/material';
import useTitle from '@/hooks/useTitle';
import { useState } from 'react';
import TelegramAuthButton, { TelegramAuthCallback } from '@/components/TelegramAuthButton';
import { Telegram } from '@mui/icons-material';
import { useAppDispatch } from '@/store';
import { setAuthToken } from '@/store/features/auth';
import getErrorMessage from '@/utils/getErrorMessage';
import { useTranslation } from 'react-i18next';
import { useAuthLoginMutation } from '@/api/api';
import ErrorAlert from '@/components/common/ErrorAlert';

export interface CommonAuthProps {
  setLoading(v: boolean): void;
  setError(v?: string): void;
}

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  useTitle(t('Login.title', 'Login'));
  const [error, setError] = useState<string>();
  const dispatch = useAppDispatch();
  const [telegramAuth] = useAuthLoginMutation();

  const handleTelegramAuth: TelegramAuthCallback = async telegramAuthDataDto => {
    if (!telegramAuthDataDto) return;
    try {
      const { access_token } = await telegramAuth({ telegramAuthDataDto }).unwrap();
      dispatch(setAuthToken(access_token));
    } catch (e) {
      setError(getErrorMessage(e, 'Telegram login failed'));
    }
  };

  return (
    <Box display='flex' mt={2} justifyContent='center'>
      <Paper sx={{ p: 2, display: 'inline-block' }}>
        <ErrorAlert error={error} />
        {TELEGRAM_BOT_ID && (
          <TelegramAuthButton
            progressButtonProps={{ buttonProps: { startIcon: <Telegram /> } }}
            onAuth={handleTelegramAuth}
          >
            {t('Login with telegram')}
          </TelegramAuthButton>
        )}
      </Paper>
    </Box>
  );
};

export default LoginPage;
