import { FC } from 'react';
import { ElectionsDto } from '@/api/api';
import NominationForm from './nomination/NominationForm';
import CandidatesList from './nomination/CandidatesList';

const ElectionsDetails: FC<Pick<ElectionsDto, 'id' | 'start' | 'end' | 'candidates'>> = ({ id, start, candidates }) => {
  if (!start || new Date(start) > new Date()) {
    return (
      <>
        <CandidatesList candidates={candidates} />
        <NominationForm electionsId={id} candidates={candidates} />
      </>
    );
  }

  return null;
};

export default ElectionsDetails;
