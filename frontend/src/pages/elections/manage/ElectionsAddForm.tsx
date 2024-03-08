import { FC, useEffect } from 'react';
import { useChatsGetQuery, useElectionsAddMutation } from '@/api/api';
import { useTranslation } from 'react-i18next';
import ElectionsInfoEditDialog from './ElectionsInfoEditDialog';
import { useAppDispatch, useAppSelector } from '@/store';
import { setShowNewElectionsButton, setShowNewElectionsDialog } from '@/store/features/new-elections-dialog';

const ElectionsAddForm: FC = () => {
  const { t } = useTranslation();
  const { showDialog } = useAppSelector(({ newElectionsDialog }) => newElectionsDialog);
  const dispatch = useAppDispatch();
  const { data: chats = [] } = useChatsGetQuery();
  const [add] = useElectionsAddMutation();

  const show = chats.length !== 0;

  useEffect(() => {
    if (show) {
      dispatch(setShowNewElectionsButton(true));
      return () => void dispatch(setShowNewElectionsButton(false));
    }
  }, [show]);

  if (!show) return;

  return (
    <ElectionsInfoEditDialog
      show={showDialog}
      dialogTitle={t('New elections')}
      confirmButtonText={t('Add')}
      onClose={() => dispatch(setShowNewElectionsDialog(false))}
      onSave={newElectionsDto => add({ newElectionsDto })}
    />
  );
};

export default ElectionsAddForm;
