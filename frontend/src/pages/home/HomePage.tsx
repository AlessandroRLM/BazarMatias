import React from 'react';
import { Typography, Box, IconButton } from "@mui/joy";
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../../hooks/auth/useAuth';
import { toggleSidebar } from '../../utils/sidebar.utils';

const HomePage = () => {
  const { user } = useAuth();

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

      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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
    </>
  );
};

export default HomePage;