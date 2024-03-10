import { CandidateDto, ResultDto } from '@/api/api';
import LabledText from '@/components/common/LabledText';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface ResultsTableProps {
  title: string;
  results: ResultDto[];
  candidates: CandidateDto[];
}

const ResultsTable: FC<ResultsTableProps> = ({ title, results, candidates }) => {
  const { t } = useTranslation();

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
          {results.map(({ user_id, result }, index) => {
            const { name = user_id } = candidates.find(entry => entry.user_id === user_id) || {};
            return (
              <TableRow key={user_id} hover>
                <TableCell sx={{ textAlign: 'center' }}>{index + 1}</TableCell>
                <TableCell>{name}</TableCell>
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
