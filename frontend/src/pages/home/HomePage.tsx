import React, { useEffect, useState } from 'react';
import { Typography, Box, IconButton, Card, CardContent, Chip, Stack } from "@mui/joy";
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
        setLowStockProducts(productsRes.results || productsRes); // según si tienes paginación
        setLowStockSupplies(suppliesRes.results || suppliesRes);
      } catch (error) {
        console.error("Error al cargar productos/insumos con bajo stock", error);
      }
    };
    loadData();
  }, []);

  const renderLowStockCard = (title: string, items: any[], type: 'producto' | 'insumo') => {
    if (items.length === 0) return null;

    return (
      <Card variant="soft" color="warning" sx={{ my: 2 }}>
        <CardContent>
          <Typography level="title-md" startDecorator={<WarningIcon />}>
            {title}
          </Typography>
          <Stack spacing={1} mt={1}>
            {items.map((item: any) => (
              <Box
                key={item.id}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  bgcolor: 'warning.softBg',
                  px: 2,
                  py: 1,
                  borderRadius: 'md',
                }}
              >
                <Typography>{item.name}</Typography>
                <Chip variant="soft" color="danger">
                  {item.stock} / min {item.min_stock}
                </Chip>
              </Box>
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
          minHeight: "30vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mt: 3
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
      <Box sx={{ px: { xs: 2, md: 4 }, pb: 4 }}>
        {renderLowStockCard("Productos con stock bajo", lowStockProducts, "producto")}
        {renderLowStockCard("Insumos con stock bajo", lowStockSupplies, "insumo")}
      </Box>
    </>
  );
};

export default HomePage;
