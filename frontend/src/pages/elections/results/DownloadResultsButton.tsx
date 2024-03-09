import { FC } from 'react';
import { CandidateDto } from '@/api/api';
import ProgressButton from '@/components/common/ProgressButton';
import { useTranslation } from 'react-i18next';
import { downloadFile } from '@/utils/downloadFile';

interface DownloadResultsButtonProps {
  candidates: CandidateDto[];
  votes: number[][];
}

const DownloadResultsButton: FC<DownloadResultsButtonProps> = props => {
  const { t } = useTranslation();

  const handleDownload = () => {
    const candidates: CandidateDto[] = props.candidates.slice();
    const votes = props.votes.map(vote => {
      return vote.map(user_id => {
        const candidate = candidates.find(entry => entry.user_id === user_id);
        if (!candidate) {
          candidates.push({ user_id, name: `#${user_id}`, program: '' });
        }
        return { user_id, name: candidate?.name || `#${user_id}` };
      });
    });
    const results = JSON.stringify({ candidates, votes }, null, 2);
    downloadFile(results, 'results.json');
  };

  return <ProgressButton onClick={handleDownload}>{t('Download results')}</ProgressButton>;
};

export default DownloadResultsButton;
