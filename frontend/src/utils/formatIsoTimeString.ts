import { t } from 'i18next';

const formatIsoTimeString = (isoTimeString?: string): string => {
  if (!isoTimeString) {
    return t('not set');
  }
  try {
    const date = new Date(isoTimeString);
    return date.toLocaleString();
  } catch {
    return isoTimeString;
  }
};

export default formatIsoTimeString;
