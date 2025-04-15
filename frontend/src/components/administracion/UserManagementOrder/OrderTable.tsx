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
import Button from '@mui/joy/Button';
import { Link as RouterLink } from '@tanstack/react-router';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';
import { demoUsers, demoTotalUsers } from '../../../data/demoUsers/demoUsers';
import { usePagination } from '../../../hooks/usePagination/usePagination';
import Pagination from '../../common/Pagination/Pagination';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import AxiosInstance from '../../../helpers/AxiosInstance';
import { deleteUser } from '../../../services/userService';

type Order = 'asc' | 'desc';

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

async function realFetchUsers({ page, pageSize }: { page: number; pageSize: number }) {
  try {
    const response = await AxiosInstance.get(`/api/users/?page=${page}&page_size=${pageSize}`);
    return {
      data: response.data.results,
      totalItems: response.data.count,
      totalPages: Math.ceil(response.data.count / pageSize),
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

export default function OrderTable() {
  const [order, setOrder] = React.useState<Order>('desc');
  const [orderBy, setOrderBy] = React.useState<string>('rut');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [open, setOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [userToDelete, setUserToDelete] = React.useState<{ id: string; name: string } | null>(null);

  const getFetchFunction = (isDemo: boolean) => {
    return isDemo ? mockFetchUsers : realFetchUsers;
  };

  const {
    data: users = [],
    currentPage,
    totalItems,
    totalPages,
    isLoading,
    isDemoMode,
    handlePageChange,
    toggleDemoMode,
    connectionStatus,
  } = usePagination(getFetchFunction, 1, 10, demoUsers, demoTotalUsers);

  const handleSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    // Aquí agregar lógica para reordenar los datos segun el backend
  };

  const handleDeleteClick = (id: string, name: string) => {
    setUserToDelete({ id, name });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      try {
        await deleteUser(userToDelete.id);
        setDeleteDialogOpen(false);
        setUserToDelete(null);
        handlePageChange(currentPage);
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const renderFilters = () => (
    <React.Fragment>
      <FormControl size="sm">
        <FormLabel>Estado</FormLabel>
        <Select
          size="sm"
          placeholder="Filtrar por estado"
          slotProps={{ button: { sx: { whiteSpace: 'nowrap' } } }}
        >
          <Option value="active">Activo</Option>
          <Option value="inactive">Inactivo</Option>
        </Select>
      </FormControl>
      <FormControl size="sm">
        <FormLabel>Cargo</FormLabel>
        <Select size="sm" placeholder="Todos">
          <Option value="all">Todos</Option>
          <Option value="admin">Admin</Option>
          <Option value="bodegero">Bodegero</Option>
          <Option value="vendedor">Vendedor</Option>
        </Select>
      </FormControl>
    </React.Fragment>
  );

  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      toggleDemoMode(true);
    }
  }, [toggleDemoMode]);

  const getButtonConfig = () => {
    if (connectionStatus === 'connecting') {
      return {
        color: 'neutral',
        icon: <AutorenewRoundedIcon />,
        text: 'Conectando...',
        loading: true
      };
    }
    if (connectionStatus === 'error') {
      return {
        color: 'danger',
        icon: <ErrorOutlineIcon />,
        text: 'Error de conexión',
        loading: false
      };
    }
    return isDemoMode ? {
      color: 'warning',
      icon: <CloudSyncIcon />,
      text: 'Conectar a backend real',
      loading: false
    } : {
      color: 'success',
      icon: <CloudDoneIcon />,
      text: 'Conectado al backend',
      loading: false
    };
  };

  const buttonConfig = getButtonConfig();

  return (
    <React.Fragment>
      {/* Banner de modo demo o chip de conexión */}
      <Box
        sx={{
          backgroundColor: isDemoMode ? 'warning.100' : 'background.level1',
          p: 1,
          mb: 2,
          borderRadius: 'sm',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography level="body-sm" color={isDemoMode ? "warning" : "success"}>
          {isDemoMode ? "Modo demo: mostrando datos de ejemplo" : "Conectado al backend real"}
        </Typography>
        <Button
          size="sm"
          variant="outlined"
          color={buttonConfig.color}
          onClick={() => toggleDemoMode(!isDemoMode)}
          loading={buttonConfig.loading}
          startDecorator={buttonConfig.icon}
          disabled={connectionStatus === 'connecting'}
        >
          {buttonConfig.text}
        </Button>
      </Box>

      <Sheet
        className="SearchAndFilters-mobile"
        sx={{ display: { xs: 'flex', sm: 'none' }, my: 1, gap: 1 }}
      >
        <Input
          size="sm"
          placeholder="Buscar Usuario"
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
          <Input size="sm" placeholder="Buscar" startDecorator={<SearchIcon />} />
        </FormControl>
        {renderFilters()}
      </Box>

      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        userName={userToDelete?.name || ''}
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
                      onClick={() => handleDeleteClick(user.id, user.name)}
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