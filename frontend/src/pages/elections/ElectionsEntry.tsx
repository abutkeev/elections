import { ElectionsDto, useElectionsEditMutation } from '@/api/api';
import LabledText from '@/components/common/LabledText';
import formatIsoTimeString from '@/utils/formatIsoTimeString';
import { Box, Divider, IconButton, Paper, Stack } from '@mui/material';
import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ElectionsInfoEditDialog from './manage/ElectionsInfoEditDialog';
import { Edit } from '@mui/icons-material';
import NominationForm from './nomination/NominationForm';
import useAuthData from '@/hooks/useAuthData';

interface ElectionsEntryProps {
  entry: ElectionsDto;
}

const ElectionsEntry: FC<ElectionsEntryProps> = ({ entry }) => {
  const { id, title, chat_title, start, end, can_edit, candidates } = entry;
  const { t } = useTranslation();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [edit] = useElectionsEditMutation();
  const auth = useAuthData();

  const nomination = useMemo(() => candidates.find(({ user_id }) => user_id === auth?.id), [candidates]);

  return (
    <Stack direction='column' my={1} spacing={1}>
      <Paper sx={{ p: 1 }}>
        <Stack direction='row' spacing={1} alignItems='center'>
          <LabledText label={chat_title} labelSuffix=',' text={title} />
          <Box flexGrow={1} />
          {can_edit && (
            <IconButton size='small' onClick={() => setShowEditDialog(true)}>
              <Edit />
            </IconButton>
          )}
        </Stack>
        <Divider />
        <LabledText label={t('Voting start time')} labelSuffix=':' text={formatIsoTimeString(start)} />
        <LabledText label={t('Voting end time')} labelSuffix=':' text={formatIsoTimeString(end)} />
        {(!start || new Date(start) > new Date()) && (
          <NominationForm electionsId={id} defaultName={nomination?.name} defaultProgram={nomination?.program} />
        )}
      </Paper>
      <ElectionsInfoEditDialog
        item={entry}
        show={showEditDialog}
        dialogTitle={t('Edit elections')}
        confirmButtonText={t('Edit')}
        onClose={() => setShowEditDialog(false)}
        onSave={newElectionsDto => edit({ id, newElectionsDto })}
      />
    </Stack>
  );
};

export default ElectionsEntry;
