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
import { deleteUser } from '../../../services/userService';
import Input from '@mui/joy/Input';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import SearchIcon from '@mui/icons-material/Search';

export default function OrderList() {
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState<string>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [userToDelete, setUserToDelete] = React.useState<{ rut: string; name: string } | null>(null);

  const fetchUsers = React.useCallback(
    async ({ page, pageSize }: { page: number; pageSize: number }) => {
      let url = `/api/users/?page=${page}&page_size=${pageSize}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (status) url += `&is_active=${status}`;
      const response = await AxiosInstance.get(url);
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
    },
    [search, status]
  );

  const {
    data: users,
    currentPage,
    totalItems,
    totalPages,
    isLoading,
    handlePageChange,
    refresh,
  } = usePagination(fetchUsers, 1, 5);

  const handleDeleteClick = (rut: string, name: string) => {
    setUserToDelete({ rut, name });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      try {
        await deleteUser(userToDelete.rut);
        alert('Usuario eliminado con éxito');
        await refresh();
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
        alert('Error al eliminar usuario');
      } finally {
        setDeleteDialogOpen(false);
        setUserToDelete(null);
      }
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  React.useEffect(() => {
    handlePageChange(1);
  }, [search, status]);

  return (
    <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        userName={userToDelete?.name || ''}
      />

      <Input
        size="sm"
        placeholder="Buscar usuario"
        value={search}
        onChange={e => setSearch(e.target.value)}
        startDecorator={<SearchIcon />}
      />
      <Select
        size="sm"
        placeholder="Filtrar por estado"
        value={status}
        onChange={(_, value) => setStatus(value ?? '')} // Nunca undefined
      >
        <Option value="">Todos</Option>
        <Option value="true">Activo</Option>
        <Option value="false">Inactivo</Option>
      </Select>

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