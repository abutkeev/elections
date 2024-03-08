import { Link, Stack, Typography } from '@mui/material';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface CandidateEntryProps {
  name: string;
  program: string;
}

const CandidateEntry: FC<CandidateEntryProps> = ({ name, program }) => {
  const { t } = useTranslation();
  const [showProgram, setShowProgram] = useState(false);

  return (
    <Stack spacing={1}>
      <Typography>{name}</Typography>
      {showProgram && <Typography variant='body2'>{program}</Typography>}
      <Link variant='body2' onClick={() => setShowProgram(!showProgram)}>
        {showProgram ? t('Hide program') : t('Show program')}
      </Link>
    </Stack>
  );
};

export default CandidateEntry;
