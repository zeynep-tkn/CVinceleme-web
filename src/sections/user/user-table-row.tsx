import { useState } from 'react';

import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type UserTableRowProps = {
  id: number;
  nameSurname: string;
  department: string;
  reason: string;
  score: number | null;
  onDelete: (id: number) => void;
  onRowClick: () => void; // Satıra tıklama fonksiyonu eklendi
};

export function UserTableRow({
  id,
  nameSurname,
  department,
  reason,
  score,
  onDelete,
  onRowClick,
}: UserTableRowProps) {
  const [open, setOpen] = useState<HTMLElement | null>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation(); // Satırın tıklanma olayını tetiklemesini engelle
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleDelete = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation(); // Satırın tıklanma olayını tetiklemesini engelle
    onDelete(id);
    handleCloseMenu();
  };

  return (
    <>
      <TableRow hover tabIndex={-1} onClick={onRowClick} sx={{ cursor: 'pointer' }}>
        <TableCell component="th" scope="row" padding="none">
          <Typography variant="subtitle2" noWrap sx={{ pl: 2 }}>
            {nameSurname}
          </Typography>
        </TableCell>

        <TableCell>{department}</TableCell>
        <TableCell>{reason}</TableCell>

        <TableCell>
          <Label color={score === null ? 'warning' : 'success'}>
            {score === null ? 'Beklemede' : score}
          </Label>
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Iconify icon="solar:trash-bin-trash-bold" sx={{ mr: 2 }} />
          Sil
        </MenuItem>
      </Popover>
    </>
  );
}