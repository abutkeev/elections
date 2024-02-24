import { ElectionsDto } from '@/api/api';
import LabledText from '@/components/common/LabledText';
import formatIsoTimeString from '@/utils/formatIsoTimeString';
import { Divider, Paper, Stack } from '@mui/material';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface ElectionsEntryProps {
  entry: ElectionsDto;
}

const ElectionsEntry: FC<ElectionsEntryProps> = ({ entry }) => {
  const { title, chat_title, start, end } = entry;
  const { t } = useTranslation();

  return (
    <Stack direction='column' my={1} spacing={1}>
      <Paper sx={{ p: 1 }}>
        <LabledText label={chat_title} labelSuffix=',' text={title} />
        <Divider />
        <LabledText label={t('Voting start time')} labelSuffix=':' text={formatIsoTimeString(start)} />
        <LabledText label={t('Voting end time')} labelSuffix=':' text={formatIsoTimeString(end)} />
      </Paper>
    </Stack>
  );
};

export default ElectionsEntry;
