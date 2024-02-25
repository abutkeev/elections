import { FC, useState } from 'react';
import { useChatsGetQuery, useElectionsAddMutation } from '@/api/api';
import { Add } from '@mui/icons-material';
import { Box, Fab, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ElectionsInfoEditDialog from './ElectionsInfoEditDialog';

const ElectionsAddForm: FC = () => {
  const { spacing } = useTheme();
  const { t } = useTranslation();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { data: chats = [] } = useChatsGetQuery();
  const [add] = useElectionsAddMutation();

  if (chats.length === 0) return;

  return (
    <>
      <Fab
        variant='extended'
        sx={{ position: 'fixed', bottom: spacing(2), right: spacing(2) }}
        onClick={() => setShowAddDialog(true)}
      >
        <Add />
        {t('New elections')}
      </Fab>
      <Box sx={{ height: { xs: spacing(8), lg: 0 } }} />
      <ElectionsInfoEditDialog
        show={showAddDialog}
        dialogTitle={t('New elections')}
        confirmButtonText={t('Add')}
        onClose={() => setShowAddDialog(false)}
        onSave={newElectionsDto => add({ newElectionsDto })}
      />
    </>
  );
};

export default ElectionsAddForm;
