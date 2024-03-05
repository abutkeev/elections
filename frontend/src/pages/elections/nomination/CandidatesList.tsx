import { FC } from 'react';
import { ElectionsDto } from '@/api/api';
import LabledText from '@/components/common/LabledText';
import { useTranslation } from 'react-i18next';
import CandidateInfo from './CandidateInfo';
import { Box, Divider } from '@mui/material';

const CandidatesList: FC<Pick<ElectionsDto, 'candidates'>> = ({ candidates }) => {
  const { t } = useTranslation();

  if (candidates.length === 0) return null;

  return (
    <>
      <Divider />
      <LabledText label={t('Candidates')} labelSuffix=':' />
      <Box ml={2}>
        {candidates.map(({ user_id, name, program }) => (
          <CandidateInfo key={user_id} name={name} program={program} />
        ))}
      </Box>
    </>
  );
};

export default CandidatesList;
