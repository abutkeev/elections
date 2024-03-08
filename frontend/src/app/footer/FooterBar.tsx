import { forwardRef } from 'react';
import { Paper, Stack, Typography } from '@mui/material';
import { BugReport, GitHub, Telegram } from '@mui/icons-material';
import useMobile from '@/hooks/useMobile';
import { useTranslation } from 'react-i18next';
import FooterBarSeparator from './FooterBarSeparator';
import FooterLink from './FooterLink';

const FooterBar = forwardRef<HTMLDivElement>((_, ref) => {
  const { t } = useTranslation();
  const mobile = useMobile();

  return (
    <Paper ref={ref}>
      <Stack
        spacing={mobile ? 0 : 1}
        direction={mobile ? 'column' : 'row'}
        m={1}
        justifyContent='center'
        alignItems='center'
      >
        <Typography variant='body2'>&copy; 2024, {t('Alexey Butkeev')}</Typography>
        <FooterBarSeparator />
        <FooterLink icon={<GitHub />} href='https://github.com/abutkeev/elections'>
          {t('Source code')}
        </FooterLink>
        <FooterBarSeparator />
        <FooterLink icon={<Telegram />} href='https://t.me/elections_auth_bot'>
          {t('Authorization bot')}
        </FooterLink>
        <FooterBarSeparator />
        <FooterLink icon={<BugReport />} href='https://github.com/abutkeev/elections/issues/new'>
          {t('Report an issue')}
        </FooterLink>
      </Stack>
    </Paper>
  );
});

export default FooterBar;
