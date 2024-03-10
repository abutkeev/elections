import { CandidateDto, useElectionsGetQuery, useElectionsVoteMutation } from '@/api/api';
import { Button, Divider, Stack } from '@mui/material';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import VoteEntry from './VoteEntry';
import { useTranslation } from 'react-i18next';
import LabledText from '@/components/common/LabledText';
import ProgressButton from '@/components/common/ProgressButton';
import FlipMove from 'react-flip-move';
import useMobile from '@/hooks/useMobile';

interface VotingProps {
  electionsId: string;
  candidates: CandidateDto[];
  vote?: number[];
}

const Voting: FC<VotingProps> = ({ electionsId, vote, candidates }) => {
  const mobile = useMobile();
  const { t } = useTranslation();
  const [places, setPlaces] = useState<CandidateDto[]>([]);
  const [last, setLast] = useState<CandidateDto[]>([]);
  const { isFetching, refetch } = useElectionsGetQuery();
  const [save] = useElectionsVoteMutation();

  const modified = useMemo(() => {
    if (!vote) {
      return !!places.length;
    }

    return JSON.stringify(vote) !== JSON.stringify(places.map(({ user_id }) => user_id));
  }, [vote, places]);

  const init = useCallback(() => {
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

  useEffect(() => init(), [init]);

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

  const handleVote = async () => {
    await save({ electionsId, body: places.map(({ user_id }) => user_id) }).unwrap();
    await refetch();
  };

  if (candidates.length === 0) {
    return <LabledText label={t('No candidates')} />;
  }

  return (
    <Stack direction='column'>
      <Stack direction='column' pl={1}>
        <FlipMove>
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
        </FlipMove>
      </Stack>
      {last.length !== 0 && (
        <Stack direction='column' pl={1}>
          <Divider />
          <LabledText label={t('Last place')} labelSuffix=':' />
          <FlipMove>
            {last.map((entry, index) => (
              <VoteEntry key={entry.user_id} entry={entry} handleRestore={getRestoreHandler(index)} />
            ))}
          </FlipMove>
        </Stack>
      )}
      {modified && (
        <Stack direction={mobile ? 'column' : 'row'} spacing={1} m={2}>
          <ProgressButton onClick={handleVote} refreshing={isFetching} fullWidth={mobile}>
            {vote ? t('Change your vote') : t('Vote')}
          </ProgressButton>
          <Button variant='outlined' onClick={init}>
            {t('Cancel')}
          </Button>
        </Stack>
      )}
    </Stack>
  );
};

export default Voting;
