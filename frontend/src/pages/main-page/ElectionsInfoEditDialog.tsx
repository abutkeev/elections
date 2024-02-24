import { FC } from 'react';
import { ElectionsDto, NewElectionsDto, useChatsGetQuery, useElectionsGetQuery } from '@/api/api';
import CustomDialog from '@/components/common/CustomDialog';
import { Stack, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CustomComboBox from '@/components/common/CustomComboBox';
import CustomDateTimePicker from '@/components/common/CustomDateTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import useUpdatingState from '@/hooks/useUpdatingState';

interface ElectionsInfoEditDialogProps {
  item?: ElectionsDto;
  show: boolean;
  dialogTitle: string;
  confirmButtonText: string;
  onClose(): void;
  onSave(data: NewElectionsDto): Promise<unknown>;
}

const ElectionsInfoEditDialog: FC<ElectionsInfoEditDialogProps> = ({
  item,
  show,
  dialogTitle,
  confirmButtonText,
  onClose,
  onSave,
}) => {
  const { t } = useTranslation();
  const [title, setTitle] = useUpdatingState(item?.title || '');
  const [chat, setChat] = useUpdatingState<number | undefined>(item?.chat_id);
  const [start, setStart] = useUpdatingState<Dayjs | null>(item?.end ? dayjs(item.start) : null);
  const [end, setEnd] = useUpdatingState<Dayjs | null>(item?.end ? dayjs(item.end) : null);
  const { data: chats = [] } = useChatsGetQuery();
  const { isFetching } = useElectionsGetQuery();

  const handleDialogClose = () => {
    onClose();
    setTitle('');
    setChat(undefined);
    setStart(null);
    setEnd(null);
  };

  const handleAdd = async () => {
    if (!chat || !title) return;
    await onSave({
      chat,
      title,
      start: start?.toISOString(),
      end: end?.toISOString(),
    });
  };

  const valid = !!title && !!chat && !(start && end && start >= end);

  const minEnd = start?.add(1);

  return (
    <CustomDialog
      open={show}
      title={dialogTitle}
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
          <CustomDateTimePicker label={t('Voting start time')} value={start} onChange={setStart} disablePast />
          <CustomDateTimePicker
            label={t('Voting end time')}
            value={end}
            onChange={setEnd}
            disablePast
            minDateTime={minEnd}
          />
        </Stack>
      }
      onCancel={handleDialogClose}
      onConfirm={handleAdd}
      confirmButtonText={confirmButtonText}
      confirmButtonProps={{ disabled: !valid, refreshing: isFetching, finalAction: handleDialogClose }}
    />
  );
};

export default ElectionsInfoEditDialog;
