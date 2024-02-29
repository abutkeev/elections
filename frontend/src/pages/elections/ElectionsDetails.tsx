import { FC } from 'react';
import { ElectionsDto } from '@/api/api';
import NominationForm from './nomination/NominationForm';
import CandidatesList from './nomination/CandidatesList';
import Voting from './voting';

const ElectionsDetails: FC<ElectionsDto> = ({ id, start, end, candidates, vote }) => {
  if (!start || new Date(start) > new Date()) {
    return (
      <>
        <CandidatesList candidates={candidates} />
        <NominationForm electionsId={id} candidates={candidates} />
      </>
    );
  }

  if (start && new Date(start) < new Date() && (!end || new Date(end) > new Date())) {
    return <Voting electionsId={id} candidates={candidates} vote={vote} />;
  }

  return null;
};

export default ElectionsDetails;
