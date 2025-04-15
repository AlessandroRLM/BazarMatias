import * as React from 'react';
import { ColorPaletteProp } from '@mui/joy/styles';
import Box from '@mui/joy/Box';
import Avatar from '@mui/joy/Avatar';
import Chip from '@mui/joy/Chip';
import Typography from '@mui/joy/Typography';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemContent from '@mui/joy/ListItemContent';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import ListDivider from '@mui/joy/ListDivider';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import BlockIcon from '@mui/icons-material/Block';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/joy/IconButton';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog'; // Asegúrate de que la ruta sea correcta

const listItems = [
  {
    rut: '12345678-9',
    name: 'Olivia Ryhe',
    email: 'olivia@email.com',
    role: 'Admin',
    status: 'Active',
  },
  {
    rut: '98765432-1',
    name: 'Steve Hampton',
    email: 'steve.hamp@email.com',
    role: 'Bodegero',
    status: 'Active',
  },
  {
    rut: '45678901-2',
    name: 'Ciaran Murray',
    email: 'ciaran.murray@email.com',
    role: 'Bodegero',
    status: 'Inactive',
  },
  {
    rut: '78901234-5',
    name: 'Maria Macdonald',
    email: 'maria.mc@email.com',
    role: 'Vendedor',
    status: 'Active',
  },
];

export default function OrderList() {
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [userToDelete, setUserToDelete] = React.useState<{ rut: string; name: string } | null>(null);

  const handleDeleteClick = (rut: string, name: string) => {
    setUserToDelete({ rut, name });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      // Aquí iría la lógica para eliminar el usuario (llamada a la API del backend)
      console.log('Eliminando usuario:', userToDelete.rut);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  return (
    <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
      {/* Diálogo de confirmación para eliminar usuario */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        userName={userToDelete?.name || ''}
      />

      {listItems.map((listItem) => (
        <List key={listItem.rut} size="sm" sx={{ '--ListItem-paddingX': 0 }}>
          <ListItem
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'start',
            }}
          >
            <ListItemContent sx={{ display: 'flex', gap: 2, alignItems: 'start' }}>
              <ListItemDecorator>
                <Avatar size="sm">{listItem.name.charAt(0)}</Avatar>
              </ListItemDecorator>
              <div>
                <Typography gutterBottom sx={{ fontWeight: 600 }}>
                  {listItem.name}
                </Typography>
                <Typography level="body-xs" gutterBottom>
                  {listItem.email}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 0.5,
                    mb: 1,
                  }}
                >
                  <Typography level="body-xs">{listItem.role}</Typography>
                  <Typography level="body-xs">&bull;</Typography>
                  <Typography level="body-xs">{listItem.rut}</Typography>
                </Box>
              </div>
            </ListItemContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                variant="soft"
                size="sm"
                startDecorator={
                  {
                    Active: <CheckRoundedIcon />,
                    Inactive: <BlockIcon />,
                    Pending: <AutorenewRoundedIcon />,
                  }[listItem.status]
                }
                color={
                  {
                    Active: 'success',
                    Inactive: 'danger',
                    Pending: 'neutral',
                  }[listItem.status] as ColorPaletteProp
                }
              >
                {listItem.status}
              </Chip>
              <IconButton
                variant="plain"
                color="danger"
                size="sm"
                aria-label="Delete"
                onClick={() => handleDeleteClick(listItem.rut, listItem.name)}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </ListItem>
          <ListDivider />
        </List>
      ))}
    </Box>
  );
}