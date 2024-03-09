import { forwardRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { Add } from '@mui/icons-material';
import { Box, Fab } from '@mui/material';
import { t } from 'i18next';
import { setShowNewElectionsDialog } from '@/store/features/new-elections-dialog';

const NewElectionsButton = forwardRef<HTMLDivElement, { bottom: number }>(({ bottom }, ref) => {
  const { showButton } = useAppSelector(({ newElectionsDialog }) => newElectionsDialog);
  const dispatch = useAppDispatch();

  if (!showButton) return null;

  return (
    <Box ref={ref} position='fixed' bottom={bottom} right={0} pb={1} pr={1}>
      <Fab variant='extended' onClick={() => dispatch(setShowNewElectionsDialog(true))}>
        <Add />
        {t('New elections')}
      </Fab>
    </Box>
  );
});

export default NewElectionsButton;
