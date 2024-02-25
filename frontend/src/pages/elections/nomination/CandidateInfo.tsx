import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Box, Divider, Stack, Typography, useTheme } from '@mui/material';
import { FC, useLayoutEffect, useRef, useState } from 'react';

interface CandidateInfoProps {
  name: string;
  program: string;
}

const CandidateInfo: FC<CandidateInfoProps> = ({ name, program }) => {
  const { palette } = useTheme();
  const programRef = useRef<HTMLSpanElement>(null);
  const [showExpandProgramButton, setShowExpandProgramButton] = useState(false);
  const [expandProgram, setExpandProgram] = useState(false);

  useLayoutEffect(() => {
    if (!programRef.current) return;
    setShowExpandProgramButton(programRef.current.clientHeight < programRef.current.scrollHeight);
  }, []);

  return (
    <Stack direction='column' spacing={1}>
      <Divider />
      <Typography>{name}</Typography>
      <Box pl={1}>
        <Typography
          ref={programRef}
          variant='body2'
          sx={{ overflowWrap: 'break-word', maxHeight: expandProgram ? undefined : '10em', overflow: 'hidden' }}
        >
          {program}
        </Typography>
        {showExpandProgramButton && (
          <Box
            display='flex'
            flexGrow={1}
            justifyContent='center'
            sx={{ cursor: 'pointer', ':hover': { backgroundColor: palette.action.hover } }}
            onClick={() => setExpandProgram(!expandProgram)}
          >
            {expandProgram ? <ExpandLess /> : <ExpandMore />}
          </Box>
        )}
      </Box>
    </Stack>
  );
};

export default CandidateInfo;
