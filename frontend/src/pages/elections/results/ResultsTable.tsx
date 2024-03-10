import { CandidateDto, ResultDto } from '@/api/api';
import LabledText from '@/components/common/LabledText';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface ResultsTableProps {
  title: string;
  results: ResultDto[];
  candidates: CandidateDto[];
}

const ResultsTable: FC<ResultsTableProps> = ({ title, results, candidates }) => {
  const { t } = useTranslation();

  const places = useMemo(
    () =>
      results.reduce<{ places: number[]; names: string[]; result: number }[]>((places, { user_id, result }, index) => {
        const place = index + 1;
        const { name = `#${user_id}` } = candidates.find(entry => entry.user_id === user_id) || {};

        if (!places.length || places[places.length - 1].result !== result) {
          places.push({ places: [place], names: [name], result });
        } else {
          const prev = places[places.length - 1];
          prev.places.push(place);
          prev.names.push(name);
        }
        return places;
      }, []),
    [results, candidates]
  );

  return (
    <>
      <LabledText variant='h6' label={title} labelSuffix=':' />
      <Table size='small'>
        <TableHead>
          <TableRow>
            <TableCell padding='checkbox' sx={{ textAlign: 'center' }}>
              {t('Place')}
            </TableCell>
            <TableCell>{t('Name')}</TableCell>
            <TableCell padding='checkbox' sx={{ textAlign: 'center' }}>
              {t('Result')}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {places.map(({ places, names, result }, index) => {
            return (
              <TableRow key={index} hover>
                <TableCell sx={{ textAlign: 'center', textWrap: 'nowrap' }}>{places.join(', ')}.</TableCell>
                <TableCell>{names.join(', ')}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>{result}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};

export default ResultsTable;
