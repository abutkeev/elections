import useTitle from '@/hooks/useTitle';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import ElectionsAddForm from './ElectionsAddForm';
import { useElectionsGetQuery } from '@/api/api';
import LoadingWrapper from '@/components/common/LoadingWrapper';
import ElectionsEntry from './ElectionsEntry';

const MainPage: FC = () => {
  const { t } = useTranslation();
  useTitle(t('Elections'));
  const { data: elections = [], isLoading, isError } = useElectionsGetQuery();

  return (
    <LoadingWrapper loading={isLoading} error={isError}>
      {elections.map(entry => (
        <ElectionsEntry key={entry.id} entry={entry} />
      ))}
      <ElectionsAddForm />
    </LoadingWrapper>
  );
};

export default MainPage;
