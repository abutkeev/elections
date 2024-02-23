import { useMemo } from 'react';
import { RouteObject, RouterProvider, createHashRouter } from 'react-router-dom';
import { useAppSelector } from '@/store';
import useAuthData from '@/hooks/useAuthData';
import Main from './Main';
import NotFound from '@/pages/NotFound';
import LoginPage from '@/pages/LoginPage';
import MainPage from '@/pages/main-page';

const userRoutes: RouteObject[] = [
  {
    path: '/',
    element: <MainPage />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

const unauthorizedRoutes: RouteObject[] = [
  {
    path: '*',
    element: <LoginPage />,
  },
];

const adminRoutes: RouteObject[] = [];

const getRoutes = ({ token, admin }: { token: string | null; admin?: boolean }): RouteObject[] => {
  if (!token) {
    return unauthorizedRoutes;
  }

  if (admin) {
    return adminRoutes.concat(userRoutes);
  }

  return userRoutes;
};

const Routes: React.FC = () => {
  const { token } = useAppSelector(({ auth }) => auth);
  const { admin } = useAuthData() || {};

  const router = useMemo(
    () =>
      createHashRouter([
        {
          element: <Main />,
          children: getRoutes({ token, admin }),
        },
      ]),
    [token, admin]
  );

  return <RouterProvider router={router} />;
};

export default Routes;
