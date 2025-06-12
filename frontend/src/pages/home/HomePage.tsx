import { useEffect, useState } from 'react';
import { 
  Typography, 
  Box, 
  IconButton, 
  Card, 
  CardContent, 
  Chip, 
  Stack,
  Divider,
  Grid
} from "@mui/joy";
import MenuIcon from '@mui/icons-material/Menu';
import WarningIcon from '@mui/icons-material/Warning';
import { useAuth } from '../../hooks/auth/useAuth';
import { toggleSidebar } from '../../utils/sidebar.utils';
import { fetchLowStockProducts, fetchLowStockSupplies } from '../../services/inventoryService';

const HomePage = () => {
  const { user } = useAuth();
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [lowStockSupplies, setLowStockSupplies] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsRes, suppliesRes] = await Promise.all([
          fetchLowStockProducts(),
          fetchLowStockSupplies()
        ]);
        setLowStockProducts(productsRes.results || productsRes);
        setLowStockSupplies(suppliesRes.results || suppliesRes);
      } catch (error) {
        console.error("Error al cargar productos/insumos con bajo stock", error);
      }
    };
    loadData();
  }, []);

  const renderLowStockCard = (title: string, items: any[]) => {
    if (items.length === 0) return null;

    return (
      <Card
        variant="outlined"
        color="warning"
        sx={{
          height: '100%',
          boxShadow: 'sm',
          '--Card-radius': '12px',
          bgcolor: 'background.surface',
          '&:hover': {
            boxShadow: 'md',
            borderColor: 'neutral.outlinedHoverBorder'
          }
        }}
      >
        <CardContent>
          <Typography 
            level="title-lg" 
            startDecorator={<WarningIcon color="warning" />}
            sx={{ alignItems: 'flex-start' }}
          >
            {title}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Stack spacing={1.5} sx={{ maxHeight: '400px', overflowY: 'auto', pr: 1 }}>
            {items.map((item: any) => (
              <Card
                key={item.id}
                variant="soft"
                color="warning"
                sx={{
                  p: 1.5,
                  borderRadius: '8px',
                  bgcolor: 'background.level1',
                  '--Card-radius': '8px'
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <Typography level="body-md" sx={{ fontWeight: 'md' }}>
                    {item.name}
                  </Typography>
                  <Chip 
                    variant="solid" 
                    color="danger"
                    size="sm"
                    sx={{
                      '--Chip-radius': '6px',
                      fontWeight: 'lg'
                    }}
                  >
                    {item.stock} / min {item.min_stock}
                  </Chip>
                </Box>
              </Card>
            ))}
          </Stack>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      {/* Header solo visible en móvil */}
      <Box
        sx={{
          display: { xs: 'flex', md: 'none' },
          alignItems: 'center',
          height: 'var(--Header-height, 52px)',
          px: 2,
          borderBottom: '1px solid var(--joy-palette-divider)',
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          backgroundColor: 'background.body',
        }}
      >
        <IconButton
          onClick={toggleSidebar}
          variant="outlined"
          color="neutral"
          size="sm"
          sx={{ mr: 1 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography level="h3" sx={{ flex: 1, textAlign: 'center' }}>
          Bazar Matias
        </Typography>
      </Box>

      {/* Bienvenida */}
      <Box
        sx={{
          minHeight: "20vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mt: 3,
          mb: 4
        }}
      >
        <Typography
          level="h1"
          sx={{
            color: "primary.solidBg",
            fontWeight: "bold",
            fontSize: { xs: "2.5rem", md: "4rem" },
            textAlign: "center",
          }}
        >
          Bienvenido{user?.first_name ? `, ${user.first_name}` : ""}!
        </Typography>
      </Box>

      {/* Notificaciones de stock bajo */}
      <Box sx={{ 
        px: { xs: 2, md: 4 }, 
        pb: 4,
        maxWidth: '1400px',
        mx: 'auto'
      }}>
        <Grid container spacing={2}>
          <Grid xs={12} md={6}>
            {renderLowStockCard("Productos con stock bajo", lowStockProducts)}
          </Grid>
          <Grid xs={12} md={6}>
            {renderLowStockCard("Insumos con stock bajo", lowStockSupplies)}
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default HomePage;