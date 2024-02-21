import { Container } from '@mui/material';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Outlet } from 'react-router-dom';
import { useAppSelector } from '@/store';
import Snackbar from './Snackbar';
import AppBar from './app-bar/AppBar';
import ReloadPrompt from './ReloadPrompt';

const Main: React.FC = () => {
  const title = useAppSelector(({ title }) => title);

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{title}</title>
        </Helmet>
      </HelmetProvider>
      <AppBar />
      <Snackbar />
      <Container sx={{ my: 1, maxWidth: 'md' }}>
        <ReloadPrompt />
        <Outlet />
      </Container>
    </>
  );
};

export default Main;
