import { useState } from 'react';
import { AdminPanelSettings, Home } from '@mui/icons-material';
import { Menu } from '@mui/material';
import useAuthData from '@/hooks/useAuthData';
import NavigateMenuItem from './NavigateMenuItem';
import AppbarMenuButton from '../app-bar/AppbarMenuButton';
import { useTranslation } from 'react-i18next';

const AdminMenu: React.FC = () => {
  const [menuAhchor, setMenuAnchor] = useState<HTMLElement>();
  const { admin } = useAuthData() || {};
  const { t } = useTranslation();

  const closeMenu = () => setMenuAnchor(undefined);

  if (!admin) return null;

  return (
    <>
      <AppbarMenuButton menuAhchor={menuAhchor} setMenuAnchor={setMenuAnchor}>
        <AdminPanelSettings />
      </AppbarMenuButton>
      <Menu anchorEl={menuAhchor} open={!!menuAhchor} onClose={closeMenu} sx={{ mt: 1 }}>
        <NavigateMenuItem title={t('Stub admin menu item')} page='/' icon={<Home />} closeMenu={closeMenu} />
      </Menu>
    </>
  );
};

export default AdminMenu;
