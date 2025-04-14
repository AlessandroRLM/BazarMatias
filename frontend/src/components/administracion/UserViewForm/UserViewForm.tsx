import { Box, Typography } from "@mui/joy";

interface UserViewData {
  name: string;
  lastName: string;
  rut: string;
  email: string;
  role: string;
}

const UserViewForm = () => {
  // Sample data - replace with actual data from props or API
  const userData: UserViewData = {
    name: "Juan",
    lastName: "Pérez",
    rut: "12.345.678-9",
    email: "juan.perez@example.com",
    role: "Administrador",
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "70%",
        margin: "auto",
        gap: 2,
      }}
    >
      <Typography level="h4" component="h2" sx={{ mb: 2 }}>
        Información del Usuario
      </Typography>
      
      <Box sx={{ width: '100%' }}>
        <Typography level="body-sm">Nombre</Typography>
        <Typography level="body-lg" sx={{ p: 1, border: '1px solid', borderColor: 'neutral.300', borderRadius: 'sm' }}>
          {userData.name}
        </Typography>
      </Box>
      
      <Box sx={{ width: '100%' }}>
        <Typography level="body-sm">Apellido</Typography>
        <Typography level="body-lg" sx={{ p: 1, border: '1px solid', borderColor: 'neutral.300', borderRadius: 'sm' }}>
          {userData.lastName}
        </Typography>
      </Box>
      
      <Box sx={{ width: '100%' }}>
        <Typography level="body-sm">RUT</Typography>
        <Typography level="body-lg" sx={{ p: 1, border: '1px solid', borderColor: 'neutral.300', borderRadius: 'sm' }}>
          {userData.rut}
        </Typography>
      </Box>
      
      <Box sx={{ width: '100%' }}>
        <Typography level="body-sm">Correo</Typography>
        <Typography level="body-lg" sx={{ p: 1, border: '1px solid', borderColor: 'neutral.300', borderRadius: 'sm' }}>
          {userData.email}
        </Typography>
      </Box>
      
      <Box sx={{ width: '100%' }}>
        <Typography level="body-sm">Cargo</Typography>
        <Typography level="body-lg" sx={{ p: 1, border: '1px solid', borderColor: 'neutral.300', borderRadius: 'sm' }}>
          {userData.role}
        </Typography>
      </Box>
    </Box>
  );
};

export default UserViewForm;