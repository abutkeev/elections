import { FC, useState } from 'react';
import { ElectionsDto } from '@/api/api';
import NominationForm from './nomination/NominationForm';
import CandidatesList from './nomination/CandidatesList';
import Voting from './voting';
import { Tab, Tabs } from '@mui/material';
import { useTranslation } from 'react-i18next';

const ElectionsDetails: FC<ElectionsDto> = ({ id, start, end, candidates, vote }) => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<'vote' | 'results'>('vote');

  if (!start || new Date(start) > new Date()) {
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
        </Tabs>
        {tab === 'vote' && <Voting electionsId={id} candidates={candidates} vote={vote} />}
      </>
    );
  }

  return null;
};

export default ElectionsDetails;
