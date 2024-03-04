import { CandidateDto } from '@/api/api';
import { Divider, Stack } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import VoteEntry from './VoteEntry';
import { useTranslation } from 'react-i18next';
import EmptyListWrapper from '@/components/common/EmptyListWrapper';
import LabledText from '@/components/common/LabledText';

interface VotingProps {
  electionsId: string;
  candidates: CandidateDto[];
  vote?: number[];
}

const Voting: FC<VotingProps> = ({ vote, candidates }) => {
  const { t } = useTranslation();
  const [places, setPlaces] = useState<CandidateDto[]>([]);
  const [last, setLast] = useState<CandidateDto[]>([]);

  useEffect(() => {
    const places: CandidateDto[] = [];
    for (const id of vote || []) {
      const candidate = candidates.find(({ user_id }) => user_id === id);
      if (!candidate) continue;
      places.push(candidate);
    }
    setPlaces(places);
    setLast(
      vote
        ? candidates.filter(({ user_id }) => !vote.includes(user_id))
        : candidates.slice().sort(() => Math.random() - 0.5)
    );
  }, [vote, candidates]);

  const getSwapHandler = (index1: number, index2: number) => () => {
    const newPlaces = places.slice();
    const tmp = newPlaces[index1];
    newPlaces[index1] = newPlaces[index2];
    newPlaces[index2] = tmp;
    setPlaces(newPlaces);
  };

  const getRemoveHandler = (index: number) => () => {
    setPlaces(places.filter((_, i) => index !== i));
    setLast([...last, places[index]]);
  };

  const getRestoreHandler = (index: number) => () => {
    setLast(last.filter((_, i) => index !== i));
    setPlaces([...places, last[index]]);
  };

  if (candidates.length === 0) {
    return <EmptyListWrapper wrap message={t('No candidates')} />;
  }

  return (
    <Stack direction='column'>
      <Stack direction='column' pl={1}>
        {places.map((entry, index) => (
          <VoteEntry
            key={entry.user_id}
            place={index + 1}
            entry={entry}
            handleUp={index !== 0 && getSwapHandler(index, index - 1)}
            handleDown={index !== places.length - 1 && getSwapHandler(index, index + 1)}
            handleRemove={getRemoveHandler(index)}
          />
        ))}
      </Stack>
      {last.length !== 0 && (
        <Stack direction='column' pl={1}>
          <Divider />
          <LabledText label={t('Last place')} labelSuffix=':' text='' />
          {last.map((entry, index) => (
            <VoteEntry key={entry.user_id} entry={entry} handleRestore={getRestoreHandler(index)} />
          ))}
        </Stack>
      )}
    </Stack>
  );
};

export default Voting;
