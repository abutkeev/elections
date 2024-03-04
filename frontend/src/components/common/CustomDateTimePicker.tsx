import { DateTimePicker, DateTimePickerProps, LocalizationProvider } from '@mui/x-date-pickers';
import { useTranslation } from 'react-i18next';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/ru';
import { FC } from 'react';
import { Dayjs } from 'dayjs';

const CustomDateTimePicker: FC<DateTimePickerProps<Dayjs>> = props => {
  const { t, i18n } = useTranslation();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={i18n.language}>
      <DateTimePicker
        slotProps={{
          field: { clearable: true, ...props.slotProps?.field },
          actionBar: { actions: ['accept', 'cancel', 'clear'], ...props.slotProps?.actionBar },
        }}
        localeText={{
          clearButtonLabel: t('Clear'),
          fieldClearLabel: t('Clear'),
          cancelButtonLabel: t('Cancel'),
          ...props.localeText,
        }}
        views={props.views || ['year', 'month', 'day', 'hours', 'minutes', 'seconds']}
        {...props}
      />
    </LocalizationProvider>
  );
};

export default CustomDateTimePicker;
