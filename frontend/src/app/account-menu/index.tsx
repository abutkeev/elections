import { useState } from 'react';
import { AccountCircle, Settings } from '@mui/icons-material';
import { Badge, Divider, IconButton, Menu, Typography } from '@mui/material';
import useAuthData from '@/hooks/useAuthData';
import AppbarMenuButton from '../app-bar/AppbarMenuButton';
import LogoutMenuItem from './LogoutMenuItem';
import SettingsDialog from './settings/SettingsDialog';
import SettingsMenuItem from './settings/SettingsMenuItem';
import useWebSocket from '@/hooks/useWebSocket';

export interface AccountMenuItemProps {
  closeMenu(): void;
}

export interface AccountMenuDialogItemProps extends AccountMenuItemProps {
  setShowDialog(v: boolean): void;
}

const AccountMenu: React.FC = () => {
  const [menuAhchor, setMenuAnchor] = useState<HTMLElement>();
  const { id, name } = useAuthData() || {};
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const connected = useWebSocket();

  const closeMenu = () => setMenuAnchor(undefined);

  if (!id) {
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
        <Badge variant='dot' color={connected ? 'success' : 'error'}>
          <AccountCircle />
        </Badge>
      </AppbarMenuButton>
      <Menu anchorEl={menuAhchor} open={!!menuAhchor} onClose={closeMenu} sx={{ mt: 1 }}>
        <Typography mx={2} my={1}>
          {name}
        </Typography>
        <Divider />
        <SettingsMenuItem setShowDialog={setShowSettingsDialog} closeMenu={closeMenu} />
        <LogoutMenuItem closeMenu={closeMenu} />
      </Menu>
      <SettingsDialog open={showSettingsDialog} close={() => setShowSettingsDialog(false)} />
    </>
  );
};

export default AccountMenu;
