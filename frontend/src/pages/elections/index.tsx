import useTitle from '@/hooks/useTitle';
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ElectionsAddForm from './manage/ElectionsAddForm';
import { useElectionsGetQuery } from '@/api/api';
import LoadingWrapper from '@/components/common/LoadingWrapper';
import ElectionsEntry from './ElectionsEntry';

const ElectionsPage: FC = () => {
  const { t } = useTranslation();
  useTitle(t('Elections'));
  const { data = [], isLoading, isError } = useElectionsGetQuery();

  const elections = useMemo(
    () =>
      data.slice().sort((a, b) => {
        // move current elections to the first place
        if (a.start && a.end && new Date(a.start) < new Date() && new Date(a.end) > new Date()) {
          return -1;
        }

        if (b.start && b.end && new Date(b.start) < new Date() && new Date(b.end) > new Date()) {
          return 1;
        }

        if (a.start === b.start) {
          return 0;
        }

        if (!b.start && a.start && new Date(a.start) < new Date()) {
          return 1;
        }

        if (b.start && (!a.start || new Date(b.start) > new Date(a.start))) {
          return 1;
        }

        return -1;
      }),
    [data]
  );

  return (
    <LoadingWrapper loading={isLoading} error={isError}>
      {elections.map(entry => (
        <ElectionsEntry key={entry.id} entry={entry} />
      ))}
      <ElectionsAddForm />
    </LoadingWrapper>
  );
};

export default ElectionsPage;
