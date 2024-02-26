import useTitle from '@/hooks/useTitle';
import { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ElectionsAddForm from './manage/ElectionsAddForm';
import { useElectionsGetQuery } from '@/api/api';
import LoadingWrapper from '@/components/common/LoadingWrapper';
import ElectionsEntry from './ElectionsEntry';
import { Tab, Tabs } from '@mui/material';

type TabName = 'voting' | 'nomination' | 'results';

const ElectionsPage: FC = () => {
  const { t } = useTranslation();
  useTitle(t('Elections'));
  const { data = [], isLoading, isError } = useElectionsGetQuery();
  const [recalculate, setRecalculate] = useState(0);

  useEffect(() => {
    const recalculateDate = data.reduce<Date | undefined>((prev, current) => {
      const start = current.start ? new Date(current.start) : undefined;
      const end = current.end ? new Date(current.end) : undefined;
      const now = new Date();

      if (end && end > now && (!prev || end < prev)) {
        return end;
      }

      if (start && start > now && (!prev || start < prev)) {
        return start;
      }

      return prev;
    }, undefined);

    if (!recalculateDate) return;

    const timerId = setTimeout(() => setRecalculate(recalculate + 1), recalculateDate.getTime() - new Date().getTime());

    return () => clearTimeout(timerId);
  }, [data, recalculate]);

  const elections: Record<TabName, typeof data> = useMemo(() => {
    const now = new Date();

    const nomination = data.filter(
      ({ start, end }) => (!start || new Date(start) > now) && (!end || new Date(end) > now)
    );

    const voting = data.filter(({ start, end }) => start && new Date(start) < now && (!end || new Date(end) > now));

    const results = data
      .filter(({ end }) => end && new Date(end) < now)
      .sort((a, b) => (new Date(a.end!) < new Date(b.end!) ? 1 : -1));

    return { nomination, voting, results };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, recalculate]);

  const haveVoting = !!elections.voting.length;
  const haveNomination = !!elections.nomination.length;
  const haveResults = !!elections.results.length;
  const [currentTab, setCurrentTab] = useState<TabName>('voting');

  const tab = useMemo(() => {
    if (!haveNomination && !haveResults && !haveVoting) return null;

    if (currentTab === 'voting' && !haveVoting) {
      return haveNomination ? 'nomination' : 'results';
    }

    if (currentTab === 'nomination' && !haveNomination) {
      return haveVoting ? 'voting' : 'results';
    }

    if (currentTab === 'results' && !haveResults) {
      return haveVoting ? 'voting' : 'nomination';
    }

    return currentTab;
  }, [currentTab, haveNomination, haveResults, haveVoting]);

  return (
    <LoadingWrapper loading={isLoading} error={isError}>
      {(haveNomination || haveVoting || haveResults) && (
        <Tabs value={tab} onChange={(_, newTab) => setCurrentTab(newTab)} variant='scrollable' scrollButtons='auto'>
          {haveVoting && <Tab value='voting' label={t('Voting')} />}
          {haveNomination && <Tab value='nomination' label={t('Nomination')} />}
          {haveResults && <Tab value='results' label={t('Results')} />}
        </Tabs>
      )}
      {tab && elections[tab].map(entry => <ElectionsEntry key={entry.id} entry={entry} />)}
      <ElectionsAddForm />
    </LoadingWrapper>
  );
};

export default ElectionsPage;
