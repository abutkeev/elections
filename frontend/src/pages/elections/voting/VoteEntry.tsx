import { CandidateDto } from '@/api/api';
import { ArrowDownward, ArrowUpward, VerticalAlignBottom, VerticalAlignTop } from '@mui/icons-material';
import { Box, Divider, IconButton, Stack, Typography } from '@mui/material';
import { forwardRef } from 'react';
import CandidateEntry from './CandidateEntry';

interface VoteEntryProps {
  entry: CandidateDto;
  place?: number;
  handleUp?: (() => void) | false;
  handleDown?: (() => void) | false;
  handleRemove?: (() => void) | false;
  handleRestore?: (() => void) | false;
}

const VoteEntry = forwardRef<HTMLDivElement, VoteEntryProps>(
  ({ place, entry: { name, program }, handleUp, handleDown, handleRemove, handleRestore }, ref) => {
    return (
      <Stack ref={ref} direction='column' spacing={1} pl={2}>
        <Divider />
        <Stack direction='row' spacing={1} alignItems='center'>
          {place && <Typography minWidth='3ch'>{place}</Typography>}
          <CandidateEntry name={name} program={program} />
          <Box flexGrow={1} />
          {handleUp && (
            <IconButton onClick={handleUp}>
              <ArrowUpward />
            </IconButton>
          )}
          {handleDown && (
            <IconButton onClick={handleDown}>
              <ArrowDownward />
            </IconButton>
          )}
          {handleRemove && (
            <IconButton onClick={handleRemove}>
              <VerticalAlignBottom />
            </IconButton>
          )}
          {handleRestore && (
            <IconButton onClick={handleRestore}>
              <VerticalAlignTop />
            </IconButton>
          )}
        </Stack>
      </Stack>
    );
  }
);

export default VoteEntry;
