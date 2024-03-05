import { CandidateDto, ResultsDto } from '@/api/api';
import LabledText from '@/components/common/LabledText';
import { Stack } from '@mui/material';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import ResultList from './ResultList';

interface ElectionsResultsProps {
  candidates?: CandidateDto[];
  results?: ResultsDto;
}

const ElectionsResults: FC<ElectionsResultsProps> = ({ candidates, results }) => {
  const { t } = useTranslation();

  if (!candidates?.length) {
    return <LabledText label={t('No candidates')} />;
  }

  if (!results || !results.votes.length) {
    return <LabledText label={t('No votes')} />;
  }

  const { votes, schulze, firsts, lasts, top5, quorum } = results;

  return (
    <Stack>
      <LabledText label={t('Number of ballots')} labelSuffix=':' text={votes.length} />
      <ResultList candidates={candidates} result={schulze} label={t('Results (Schulze method)')} />
      <ResultList candidates={candidates} result={firsts} label={t('First places top')} />
      <ResultList candidates={candidates} result={lasts} label={t('Last places top')} />
      <ResultList candidates={candidates} result={top5} label={t('Entries in the top 5')} />
      <LabledText label={t('Quorum')} labelSuffix=':' text={quorum} />
    </Stack>
  );
};

export default ElectionsResults;
