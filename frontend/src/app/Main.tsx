import { Container } from '@mui/material';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Outlet } from 'react-router-dom';
import { useAppSelector } from '@/store';
import Snackbar from './Snackbar';
import AppBar from './app-bar/AppBar';
import ReloadPrompt from './ReloadPrompt';
import Footer from './footer';
import { useRef } from 'react';

const Main: React.FC = () => {
  const title = useAppSelector(({ title }) => title);
  const mainRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{title}</title>
        </Helmet>
      </HelmetProvider>
      <AppBar />
      <Snackbar />
      <Container ref={mainRef} sx={{ my: 1, maxWidth: 'md', overflow: 'hidden' }}>
        <ReloadPrompt />
        <Outlet />
      </Container>
      <Footer mainRef={mainRef} />
    </>
  );
};

export default Main;
