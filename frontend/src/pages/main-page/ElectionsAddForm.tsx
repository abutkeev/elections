import { FC, useState } from 'react';
import { useChatsGetQuery, useElectionsAddMutation } from '@/api/api';
import CustomDialog from '@/components/common/CustomDialog';
import { Add } from '@mui/icons-material';
import { Box, Fab, Stack, TextField, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CustomComboBox from '@/components/common/CustomComboBox';

const ElectionsAddForm: FC = () => {
  const { spacing } = useTheme();
  const { t } = useTranslation();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [title, setTitle] = useState('');
  const [chat, setChat] = useState<number>();
  const { data: chats = [] } = useChatsGetQuery();
  const [add] = useElectionsAddMutation();

  const handleDialogClose = () => {
    setShowAddDialog(false);
    setTitle('');
    setChat(undefined);
  };

  const handleAdd = async () => {
    if (!chat || !title) return;
    await add({ newElectionsDto: { chat, title } });
    handleDialogClose();
  };

  const valid = !!title && !!chat;

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
      <CustomDialog
        open={showAddDialog}
        title={t('New elections')}
        content={
          <Stack direction='column' spacing={2} mt={1}>
            <TextField
              label={t('Title')}
              required
              error={!title}
              value={title}
              onChange={({ target: { value } }) => setTitle(value)}
            />
            <CustomComboBox
              options={chats.map(({ id, title }) => ({ id, name: title }))}
              label={t('Chat')}
              value={chat}
              setValue={setChat}
            />
          </Stack>
        }
        onCancel={handleDialogClose}
        onConfirm={handleAdd}
        confirmButtonText={t('Add')}
        confirmButtonProps={{ disabled: !valid }}
      />
    </>
  );
};

export default ElectionsAddForm;
