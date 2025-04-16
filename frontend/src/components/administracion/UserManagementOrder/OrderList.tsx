import * as React from 'react';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import List from '@mui/joy/List';
import { usePagination } from '../../../hooks/usePagination/usePagination';
import Pagination from '../../common/Pagination/Pagination';
import Avatar from '@mui/joy/Avatar';
import ListItem from '@mui/joy/ListItem';
import ListItemContent from '@mui/joy/ListItemContent';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import ListDivider from '@mui/joy/ListDivider';
import IconButton from '@mui/joy/IconButton';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';
import { Link as RouterLink } from '@tanstack/react-router';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AxiosInstance from '../../../helpers/AxiosInstance';

// Función para traer usuarios reales del backend
async function fetchUsers({ page, pageSize }: { page: number; pageSize: number }) {
  const response = await AxiosInstance.get(`/api/users/?page=${page}&page_size=${pageSize}`);
  return {
    data: response.data.results.map((u: any) => ({
      id: u.id,
      name: u.first_name,
      rut: u.national_id,
      email: u.email,
      role: u.position,
      status: u.is_active ? 'Active' : 'Inactive',
    })),
    totalItems: response.data.count,
    totalPages: Math.ceil(response.data.count / pageSize),
  };
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
    handlePageChange,
  } = usePagination(fetchUsers, 1, 5);

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
              <IconButton
                variant="plain"
                color="neutral"
                size="sm"
                aria-label="View"
                component={RouterLink}
                to={`/administracion/usuarios/ver-usuario/${user.rut}`}
              >
                <VisibilityIcon />
              </IconButton>
              <IconButton
                component={RouterLink}
                to={`/administracion/usuarios/editar-usuario/${user.rut}`}
                variant="plain"
                color="neutral"
                size="sm"
                aria-label="Edit"
              >
                <EditIcon />
              </IconButton>
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