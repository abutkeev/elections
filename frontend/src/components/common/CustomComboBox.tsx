import { SyntheticEvent, useEffect, useMemo, useState } from 'react';
import { Autocomplete, AutocompleteInputChangeReason, SxProps, TextField } from '@mui/material';

interface CustomComboBoxProps<T> {
  options: {
    id: T;
    name: string;
  }[];
  label: string;
  value?: T;
  setValue(v?: T): void;
  sx?: SxProps;
  required?: boolean;
  loading?: boolean;
}

function CustomComboBox<T>({ options, label, value, setValue, sx, required = true, loading }: CustomComboBoxProps<T>) {
  const autoCompleteOptions = useMemo(() => options.map(({ id, name: label }) => ({ id, label })), [options]);
  const autoCompleteValue = useMemo(
    () => autoCompleteOptions.filter(({ id }) => id === value)[0] || null,
    [autoCompleteOptions, value]
  );
  const [inputValue, setInputValue] = useState('');
  
  useEffect(() => {
    if (inputValue && !value && !autoCompleteOptions.find(({ label }) => inputValue === label)) return;
    setInputValue((autoCompleteValue && autoCompleteValue.label) || `${value || ''}`);
  }, [autoCompleteValue, autoCompleteOptions, value, inputValue]);

  const handleInputChange = (_: SyntheticEvent, v: string, reason: AutocompleteInputChangeReason) => {
    if (reason === 'reset') return;
    setInputValue(v);
    if (!autoCompleteValue && value) {
      setValue(undefined);
    }
  };

  return (
    <Autocomplete
      sx={{ mt: 2, ...sx }}
      loading={loading}
      options={autoCompleteOptions}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      renderInput={params => (
        <TextField {...params} label={label} required={required} error={required && !autoCompleteValue} />
      )}
      onChange={(_, v) => setValue(v?.id)}
      value={autoCompleteValue}
    />
  );
}

export default CustomComboBox;
