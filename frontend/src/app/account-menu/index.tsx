import { useState } from 'react';
import { AccountCircle, Settings } from '@mui/icons-material';
import { IconButton, Menu } from '@mui/material';
import useAuthData from '@/hooks/useAuthData';
import AppbarMenuButton from '../app-bar/AppbarMenuButton';
import LogoutMenuItem from './LogoutMenuItem';
import SettingsDialog from './settings/SettingsDialog';
import SettingsMenuItem from './settings/SettingsMenuItem';

export interface AccountMenuItemProps {
  closeMenu(): void;
}

export interface AccountMenuDialogItemProps extends AccountMenuItemProps {
  setShowDialog(v: boolean): void;
}

const AccountMenu: React.FC = () => {
  const [menuAhchor, setMenuAnchor] = useState<HTMLElement>();
  const { login } = useAuthData() || {};
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);

  const closeMenu = () => setMenuAnchor(undefined);

  if (!login) {
    return (
      <>
        <IconButton color='inherit' onClick={() => setShowSettingsDialog(true)}>
          <Settings />
        </IconButton>
        <SettingsDialog open={showSettingsDialog} close={() => setShowSettingsDialog(false)} />
      </>
    );
  }

  return (
    <>
      <AppbarMenuButton menuAhchor={menuAhchor} setMenuAnchor={setMenuAnchor}>
        <AccountCircle />
      </AppbarMenuButton>
      <Menu anchorEl={menuAhchor} open={!!menuAhchor} onClose={closeMenu} sx={{ mt: 1 }}>
        <SettingsMenuItem setShowDialog={setShowSettingsDialog} closeMenu={closeMenu} />
        <LogoutMenuItem closeMenu={closeMenu} />
      </Menu>
      <SettingsDialog open={showSettingsDialog} close={() => setShowSettingsDialog(false)} />
    </>
  );
};

export default AccountMenu;
