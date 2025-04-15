import * as React from 'react';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import List from '@mui/joy/List';
import { usePagination } from '../../../hooks/usePagination/usePagination';
import Pagination from '../../common/Pagination/Pagination';
import { demoUsers, demoTotalUsers } from '../../../data/demoUsers/demoUsers';
import Avatar from '@mui/joy/Avatar';
import Chip from '@mui/joy/Chip';
import ListItem from '@mui/joy/ListItem';
import ListItemContent from '@mui/joy/ListItemContent';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import ListDivider from '@mui/joy/ListDivider';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import BlockIcon from '@mui/icons-material/Block';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/joy/IconButton';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';
import { ColorPaletteProp } from '@mui/joy/styles';

async function mockFetchUsers({ page, pageSize }: { page: number; pageSize: number }) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: [],
        totalItems: 0,
        totalPages: 0,
      });
    }, 500);
  });
}

export default function OrderList() {
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [userToDelete, setUserToDelete] = React.useState<{ rut: string; name: string } | null>(null);

  const {
    data: users,
    currentPage,
    totalItems,
    totalPages,
    isLoading,
    isDemoMode,
    handlePageChange,
    toggleDemoMode,
  } = usePagination(mockFetchUsers, 1, 5, demoUsers, demoTotalUsers);

  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      toggleDemoMode(true);
    }
  }, [toggleDemoMode]);

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
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        userName={userToDelete?.name || ''}
      />

      {/* Banner de modo demo para móvil */}
      {isDemoMode && (
        <Box
          sx={{
            backgroundColor: 'warning.100',
            p: 1,
            mb: 2,
            borderRadius: 'sm',
          }}
        >
          <Typography level="body-sm" color="warning">
            Modo demo activado
          </Typography>
        </Box>
      )}

      {users.map((user) => (
        <List key={user.id} size="sm" sx={{ '--ListItem-paddingX': 0 }}>
          <ListItem
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'start',
            }}
          >
            <ListItemContent sx={{ display: 'flex', gap: 2, alignItems: 'start' }}>
              <ListItemDecorator>
                <Avatar size="sm">{user.name.charAt(0)}</Avatar>
              </ListItemDecorator>
              <div>
                <Typography gutterBottom sx={{ fontWeight: 600 }}>
                  {user.name}
                </Typography>
                <Typography level="body-xs" gutterBottom>
                  {user.email}
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
                  <Typography level="body-xs">{user.role}</Typography>
                  <Typography level="body-xs">&bull;</Typography>
                  <Typography level="body-xs">{user.rut}</Typography>
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
                  }[user.status]
                }
                color={
                  {
                    Active: 'success',
                    Inactive: 'danger',
                    Pending: 'neutral',
                  }[user.status] as ColorPaletteProp
                }
              >
                {user.status}
              </Chip>
              <IconButton
                variant="plain"
                color="danger"
                size="sm"
                aria-label="Delete"
                onClick={() => handleDeleteClick(user.rut, user.name)}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </ListItem>
          <ListDivider />
        </List>
      ))}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={5}
        onPageChange={handlePageChange}
        isLoading={isLoading}
        showDesktop={false} // Solo mostrar en móvil
      />
    </Box>
  );
}