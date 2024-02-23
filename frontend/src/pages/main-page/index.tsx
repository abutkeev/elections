import useTitle from '@/hooks/useTitle';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import ElectionsAddForm from './ElectionsAddForm';

const MainPage: FC = () => {
  const { t } = useTranslation();
  useTitle(t('Elections'));

  return (
    <>
      <ElectionsAddForm />
    </>
  );
};

export default MainPage;
