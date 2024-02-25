import { useElectionsGetQuery, useElectionsNominateMutation, useElectionsWithdrawMutation } from '@/api/api';
import LabledText from '@/components/common/LabledText';
import ProgressButton from '@/components/common/ProgressButton';
import useAuthData from '@/hooks/useAuthData';
import useUpdatingState from '@/hooks/useUpdatingState';
import { Button, Divider, Stack, TextField } from '@mui/material';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface NominationProps {
  electionsId: string;
  defaultName?: string;
  defaultProgram?: string;
}

const Nomination: FC<NominationProps> = ({ electionsId, defaultName, defaultProgram }) => {
  const { t } = useTranslation();
  const auth = useAuthData();
  const nominated = defaultName !== undefined;
  const [showForm, setShowForm] = useUpdatingState(nominated);
  const [name, setName] = useUpdatingState(defaultName || auth?.name || '');
  const [program, setProgram] = useUpdatingState(defaultProgram || '');
  const { isFetching } = useElectionsGetQuery();
  const [nominate] = useElectionsNominateMutation();
  const [withdraw] = useElectionsWithdrawMutation();

  const handleNominate = async () => {
    await nominate({ electionsId, nominationDto: { name, program } });
  };

  const handleWithdraw = async () => {
    await withdraw({ electionsId });
  };

  if (!showForm) {
    return (
      <>
        <Divider sx={{ mb: 1 }} />
        <Button variant='contained' onClick={() => setShowForm(true)}>
          {t('Nominate yourself')}
        </Button>
      </>
    );
  }

  return (
    <>
      <Divider />
      <LabledText label={t('Nomination')} labelSuffix=':' text='' />
      <Stack direction='column' spacing={2} pl={2}>
        <TextField fullWidth label={t('Name')} value={name} onChange={({ target: { value } }) => setName(value)} />
        <TextField
          fullWidth
          multiline
          minRows={4}
          label={t('Program')}
          value={program}
          onChange={({ target: { value } }) => setProgram(value)}
        />
        <Stack direction='row' spacing={1}>
          <ProgressButton refreshing={isFetching} onClick={handleNominate}>
            {nominated ? t('Update data') : t('Nominate yourself')}
          </ProgressButton>
          {nominated && (
            <ProgressButton buttonProps={{ color: 'error' }} refreshing={isFetching} onClick={handleWithdraw}>
              {t('Withdraw')}
            </ProgressButton>
          )}
        </Stack>
      </Stack>
    </>
  );
};

export default Nomination;
