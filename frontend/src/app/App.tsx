import { FC, StrictMode } from 'react';
import { store } from '@/store';
import { CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import ThemeProvider from './ThemeProvider';
import Routes from './Routes';

const App: FC = () => (
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <CssBaseline />
        <Routes />
      </ThemeProvider>
    </Provider>
  </StrictMode>
);

export default App;
