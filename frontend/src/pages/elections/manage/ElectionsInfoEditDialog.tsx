import { FC, useMemo } from 'react';
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
  const defaultTitle = item?.title || '';
  const defaultChat = item?.chat_id;
  const defaultStart = useMemo(() => (item?.start ? dayjs(item.start) : null), [item?.start]);
  const defaultEnd = useMemo(() => (item?.end ? dayjs(item.end) : null), [item?.end]);
  const [title, setTitle] = useUpdatingState(defaultTitle);
  const [chat, setChat] = useUpdatingState<number | undefined>(defaultChat);
  const [start, setStart] = useUpdatingState<Dayjs | null>(defaultStart);
  const [end, setEnd] = useUpdatingState<Dayjs | null>(defaultEnd);
  const { data: chats = [] } = useChatsGetQuery();
  const { isFetching } = useElectionsGetQuery();

  const handleDialogClose = () => {
    onClose();
    setTimeout(() => {
      setTitle(defaultTitle);
      setChat(defaultChat);
      setStart(defaultStart);
      setEnd(defaultEnd);
    }, 1000);
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
          <CustomDateTimePicker label={t('Voting start time')} value={start} onChange={setStart} />
          <CustomDateTimePicker label={t('Voting end time')} value={end} onChange={setEnd} minDateTime={minEnd} />
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
