import * as React from 'react';
import Box from '@mui/joy/Box';
import Checkbox from '@mui/joy/Checkbox';
import Table from '@mui/joy/Table';
import Typography from '@mui/joy/Typography';
import Link from '@mui/joy/Link';
import IconButton from '@mui/joy/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Sheet from '@mui/joy/Sheet';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import SearchIcon from '@mui/icons-material/Search';
import { Link as RouterLink } from '@tanstack/react-router';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';
import { usePagination } from '../../../hooks/usePagination/usePagination';
import Pagination from '../../common/Pagination/Pagination';
import AxiosInstance from '../../../helpers/AxiosInstance';
import { deleteUser } from '../../../services/userService';

type Order = 'asc' | 'desc';

export default function OrderTable() {
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState<string>('');
  const [role, setRole] = React.useState<string>('');

  // Actualiza fetchUsers para usar los estados de búsqueda y filtros
  const fetchUsers = React.useCallback(
    async ({ page, pageSize }: { page: number; pageSize: number }) => {
      let url = `/api/users/users/?page=${page}&page_size=${pageSize}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (status) url += `&is_active=${status}`;
      if (role && role !== 'all') url += `&position=${role}`;
      const response = await AxiosInstance.get(url);
      return {
        data: response.data.results.map((u: any) => ({
          id: u.id,
          name: u.first_name,
          rut: u.national_id,
          email: u.email,
          role: u.position,
          status: u.is_active ? 'Activo' : 'Inactivo',
        })),
        totalItems: response.data.count,
        totalPages: Math.ceil(response.data.count / pageSize),
      };
    },
    [search, status, role]
  );

  const {
    data: users = [],
    currentPage,
    totalItems,
    totalPages,
    isLoading,
    handlePageChange,
    refresh,
  } = usePagination(fetchUsers, 1, 10);

  const [order, setOrder] = React.useState<Order>('desc');
  const [orderBy, setOrderBy] = React.useState<string>('rut');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [userToDelete, setUserToDelete] = React.useState<{ id: string; name: string } | null>(null);

  const handleSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    // Aquí agregar lógica para reordenar los datos segun el backend
  };

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

  // Cuando cambian los filtros o búsqueda, vuelve a la página 1
  React.useEffect(() => {
    handlePageChange(1);
  }, [search, status, role]);

  const renderFilters = () => (
    <React.Fragment>
      <FormControl size="sm">
        <FormLabel>Estado</FormLabel>
        <Select
          size="sm"
          placeholder="Filtrar por estado"
          value={status}
          onChange={(_, value) => setStatus(value ?? '')}
          slotProps={{ button: { sx: { whiteSpace: 'nowrap' } } }}
        >
          <Option value="">Todos</Option>
          <Option value="true">Activo</Option>
          <Option value="false">Inactivo</Option>
        </Select>
      </FormControl>
      <FormControl size="sm">
        <FormLabel>Cargo</FormLabel>
        <Select
          size="sm"
          placeholder="Todos"
          value={role}
          onChange={(_, value) => setRole(value ?? '')}
        >
          <Option value="">Todos</Option>
          <Option value="admin">Admin</Option>
          <Option value="bodegero">Bodegero</Option>
          <Option value="vendedor">Vendedor</Option>
        </Select>
      </FormControl>
    </React.Fragment>
  );

  return (
    <React.Fragment>
      <Sheet
        className="SearchAndFilters-mobile"
        sx={{ display: { xs: 'flex', sm: 'none' }, my: 1, gap: 1 }}
      >
        <Input
          size="sm"
          placeholder="Buscar Usuario"
          value={search}
          onChange={e => setSearch(e.target.value)}
          startDecorator={<SearchIcon />}
          sx={{ flexGrow: 1 }}
        />
      </Sheet>
      <Box
        className="SearchAndFilters-tabletUp"
        sx={{
          borderRadius: 'sm',
          py: 2,
          display: { xs: 'none', sm: 'flex' },
          flexWrap: 'wrap',
          gap: 1.5,
          '& > *': {
            minWidth: { xs: '120px', md: '160px' },
          },
        }}
      >
        <FormControl sx={{ flex: 1 }} size="sm">
          <FormLabel>Buscar por Nombre de Usuario</FormLabel>
          <Input
            size="sm"
            placeholder="Buscar"
            value={search}
            onChange={e => setSearch(e.target.value)}
            startDecorator={<SearchIcon />}
          />
        </FormControl>
        {renderFilters()}
      </Box>

      <ConfirmDialog
        open={deleteDialogOpen}
        title='Eliminar Usuario'
        content={`¿Estás seguro de que deseas eliminar a "${userToDelete?.name}"?`}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />

      <Sheet
        className="OrderTableContainer"
        variant="outlined"
        sx={{
          display: { xs: 'none', sm: 'initial' },
          width: '100%',
          borderRadius: 'sm',
          flexShrink: 1,
          overflow: 'auto',
          minHeight: 0,
        }}
      >
        <Table
          aria-labelledby="tableTitle"
          stickyHeader
          hoverRow
          sx={{
            '--TableCell-headBackground': 'var(--joy-palette-background-level1)',
            '--Table-headerUnderlineThickness': '1px',
            '--TableRow-hoverBackground': 'var(--joy-palette-background-level1)',
            '--TableCell-paddingY': '4px',
            '--TableCell-paddingX': '8px',
          }}
        >
          <thead>
            <tr>
              <th style={{ width: 48, textAlign: 'center', padding: '12px 6px' }}>
                <Checkbox
                  size="sm"
                  indeterminate={selected.length > 0 && selected.length !== users.length}
                  checked={selected.length === users.length && users.length > 0}
                  onChange={(event) => {
                    setSelected(event.target.checked ? users.map((row: any) => row.id) : []);
                  }}
                  color={selected.length > 0 || selected.length === users.length ? 'primary' : undefined}
                  sx={{ verticalAlign: 'text-bottom' }}
                />
              </th>
              <th style={{ width: 120, padding: '12px 6px' }}>
                <Link
                  underline="none"
                  color="primary"
                  component="button"
                  onClick={() => handleSort('rut')}
                  endDecorator={<ArrowDropDownIcon />}
                  sx={{
                    fontWeight: 'lg',
                    '& svg': {
                      transition: '0.2s',
                      transform: orderBy === 'rut' && order === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)',
                    },
                  }}
                >
                  Rut
                </Link>
              </th>
              <th style={{ width: 140, padding: '12px 6px' }}>
                <Link
                  underline="none"
                  color="primary"
                  component="button"
                  onClick={() => handleSort('name')}
                  endDecorator={<ArrowDropDownIcon />}
                  sx={{
                    fontWeight: 'lg',
                    '& svg': {
                      transition: '0.2s',
                      transform: orderBy === 'name' && order === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)',
                    },
                  }}
                >
                  Nombre
                </Link>
              </th>
              <th style={{ width: 140, padding: '12px 6px' }}>
                <Link
                  underline="none"
                  color="primary"
                  component="button"
                  onClick={() => handleSort('email')}
                  endDecorator={<ArrowDropDownIcon />}
                  sx={{
                    fontWeight: 'lg',
                    '& svg': {
                      transition: '0.2s',
                      transform: orderBy === 'email' && order === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)',
                    },
                  }}
                >
                  Correo
                </Link>
              </th>
              <th style={{ width: 140, padding: '12px 6px' }}>
                <Link
                  underline="none"
                  color="primary"
                  component="button"
                  onClick={() => handleSort('role')}
                  endDecorator={<ArrowDropDownIcon />}
                  sx={{
                    fontWeight: 'lg',
                    '& svg': {
                      transition: '0.2s',
                      transform: orderBy === 'role' && order === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)',
                    },
                  }}
                >
                  Cargo
                </Link>
              </th>
              <th style={{ width: 140, padding: '12px 6px' }}>
                <Typography fontWeight="lg">Acciones</Typography>
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: any) => (
              <tr key={user.id}>
                <td style={{ textAlign: 'center', width: 120 }}>
                  <Checkbox
                    size="sm"
                    checked={selected.includes(user.id)}
                    color={selected.includes(user.id) ? 'primary' : undefined}
                    onChange={(event) => {
                      setSelected((ids) =>
                        event.target.checked ? ids.concat(user.id) : ids.filter((id) => id !== user.id),
                      );
                    }}
                    sx={{ verticalAlign: 'text-bottom' }}
                  />
                </td>
                <td>
                  <Typography level="body-xs">{user.rut}</Typography>
                </td>
                <td>
                  <Typography level="body-xs">{user.name}</Typography>
                </td>
                <td>
                  <Typography level="body-xs">{user.email}</Typography>
                </td>
                <td>
                  <Typography level="body-xs">{user.role}</Typography>
                </td>
                <td>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 1,
                      ml: -3,
                    }}
                  >
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
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={10}
        onPageChange={handlePageChange}
        isLoading={isLoading}
      />
    </React.Fragment>
  );
}