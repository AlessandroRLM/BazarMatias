import * as React from 'react';
import { Box, Typography, TextField, Button } from '@mui/joy';

export default function UserCreation() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: 2,
        px: 2,
      }}
    >
      <Typography level="h2" component="h1">
        Crear Usuario
      </Typography>
      <TextField label="Nombre" placeholder="Ingrese el nombre" fullWidth />
      <TextField label="Correo" placeholder="Ingrese el correo" fullWidth />
      <TextField label="Rol" placeholder="Ingrese el rol" fullWidth />
      <Button
        color="primary"
        size="md"
        onClick={() => console.log('Usuario creado')}
      >
        Crear Usuario
      </Button>
    </Box>
  );
}