import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import { Link } from '@tanstack/react-router';
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import OrderTable from '../../../components/administracion/UserManagementOrder/OrderTable';
import OrderList from '../../../components/administracion/UserManagementOrder/OrderList';
import Header from '../../../components/core/layout/components/Header';

export default function UserManagementPage() {
  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Header />
      
      <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
        <Box
          component="main"
          className="MainContent"
          sx={{
            px: { xs: 2, md: 6 },
            pt: {
              xs: 'calc(12px + var(--Header-height))',
              sm: 'calc(12px + var(--Header-height))',
              md: 3,
            },
            pb: { xs: 2, sm: 2, md: 3 },
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            height: '100dvh',
            gap: 1,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              mb: 1,
              gap: 1,
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'start', sm: 'center' },
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}
          >
            <Typography level="h2" component="h1">
              Lista de Usuarios
            </Typography>
            <Button
              color="primary"
              startDecorator={<PersonAddRoundedIcon />}
              size="sm"
              component={Link}
              to="/administracion/usuarios/crear-usuario"
            >
              Añadir Usuario
            </Button>
          </Box>
          
          <OrderTable />
          <OrderList />
        </Box>
      </Box>
    </CssVarsProvider>
  );
}