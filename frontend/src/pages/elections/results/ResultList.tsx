import { CandidateDto, ResultDto } from '@/api/api';
import LabledText from '@/components/common/LabledText';
import { Stack, Typography } from '@mui/material';
import { FC } from 'react';

interface ResultListProps {
  label: string;
  result: ResultDto[];
  candidates: CandidateDto[];
}

const ResultList: FC<ResultListProps> = ({ label, result, candidates }) => {
  return (
    <>
      <LabledText label={label} labelSuffix=':' />
      <Stack spacing={1} ml={2}>
        {result.map(({ user_id, result }, index) => {
          const { name = user_id } = candidates.find(entry => entry.user_id === user_id) || {};
          return (
            <Stack key={user_id} direction='row' spacing={1} alignItems='center'>
              <Typography>{index + 1}</Typography>
              <Typography>
                {name}: {result}
              </Typography>
            </Stack>
          );
        })}
      </Stack>
    </>
  );
};

export default ResultList;
