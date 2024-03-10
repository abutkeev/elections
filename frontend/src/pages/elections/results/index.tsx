import { CandidateDto, ResultsDto } from '@/api/api';
import LabledText from '@/components/common/LabledText';
import { Divider, Stack, Typography } from '@mui/material';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import ResultsTable from './ResultsTable';
import CustomAccordion from '@/components/common/CustomAccordion';
import DownloadResultsButton from './DownloadResultsButton';

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
      <ResultsTable candidates={candidates} results={schulze} title={t('Results (Schulze method)')} />
      <Divider />
      <LabledText label={t('Number of ballots')} labelSuffix=':' text={votes.length} />
      <Divider />
      <LabledText label={t('Quorum')} labelSuffix=':' text={quorum} />
      <Divider />
      <CustomAccordion
        summary={<Typography>{t('Statistics')}</Typography>}
        details={
          <>
            <ResultsTable candidates={candidates} results={firsts} title={t('First places top')} />
            <Divider />
            <ResultsTable candidates={candidates} results={lasts} title={t('Last places top')} />
            <Divider />
            <ResultsTable candidates={candidates} results={top5} title={t('Entries in the top 5')} />
          </>
        }
      />
      <DownloadResultsButton candidates={candidates} votes={votes} />
    </Stack>
  );
};

export default ElectionsResults;
