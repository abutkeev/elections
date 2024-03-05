import { FC, useState } from 'react';
import { ElectionsDto } from '@/api/api';
import NominationForm from './nomination/NominationForm';
import CandidatesList from './nomination/CandidatesList';
import Voting from './voting';
import { Tab, Tabs } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ElectionsResults from './results';

const ElectionsDetails: FC<ElectionsDto> = ({ id, start, end, candidates, vote, results }) => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<'vote' | 'results'>('vote');

  if ((!start && (!end || new Date(end) > new Date())) || (start && new Date(start) > new Date())) {
    return (
      <>
        <CandidatesList candidates={candidates} />
        <NominationForm electionsId={id} candidates={candidates} />
      </>
    );
  }

  if (start && new Date(start) < new Date() && (!end || new Date(end) > new Date())) {
    return (
      <>
        <Tabs value={tab} onChange={(_, newTab) => setTab(newTab)} scrollButtons='auto' variant='scrollable'>
          <Tab value='vote' label={t('My vote')} />
          <Tab value='results' label={t('Current results')} />
        </Tabs>
        {tab === 'vote' && <Voting electionsId={id} candidates={candidates} vote={vote} />}
        {tab === 'results' && <ElectionsResults candidates={candidates} results={results} />}
      </>
    );
  }

  return <ElectionsResults candidates={candidates} results={results} />;
};

export default ElectionsDetails;
