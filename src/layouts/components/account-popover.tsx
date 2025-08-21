import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { menuItemClasses } from '@mui/material/MenuItem';

import { useRouter } from 'src/routes/hooks';

// ----------------------------------------------------------------------

// Component'in alacağı propları güncelliyoruz.
export type AccountPopoverProps = {
  // Dinamik kullanıcı verisi için bir obje
  account: {
    displayName: string;
    email: string;
    photoURL: string;
  };
  // Dışarıdan bir çıkış yapma fonksiyonu
  onLogout: () => void;
};

export function AccountPopover({ account, onLogout }: AccountPopoverProps) {
  const router = useRouter();
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleLogout = useCallback(() => {
    handleClosePopover();
    onLogout(); // Dışarıdan gelen onLogout fonksiyonunu çağır
  }, [handleClosePopover, onLogout]);

  return (
    <>
      <IconButton
        onClick={handleOpenPopover}
        sx={{
          p: '2px',
          width: 40,
          height: 40,
          background: (theme) =>
            `conic-gradient(${theme.vars.palette.primary.light}, ${theme.vars.palette.warning.light}, ${theme.vars.palette.primary.light})`,
        }}
      >
        <Avatar src={account.photoURL} alt={account.displayName} sx={{ width: 1, height: 1 }}>
          {account.displayName.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: { width: 200 },
          },
        }}
      >
        <Box sx={{ p: 2, pb: 1.5 }}>
          <Typography variant="subtitle2" noWrap>
            {account.displayName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {account.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {/* Menü listesi gerekirse buraya eklenebilir */}

        <Box sx={{ p: 1 }}>
          <Button fullWidth color="error" size="medium" variant="text" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Popover>
    </>
  );
}
