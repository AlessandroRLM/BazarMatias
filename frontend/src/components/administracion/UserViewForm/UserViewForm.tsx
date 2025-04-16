import { Box, Typography } from "@mui/joy";

interface UserViewData {
  name: string;
  lastName: string;
  rut: string;
  email: string;
  role: string;
}

interface UserViewFormProps {
  user: UserViewData;
}

const UserViewForm = ({ user }: UserViewFormProps) => {
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
          {user.name}
        </Typography>
      </Box>
      
      <Box sx={{ width: '100%' }}>
        <Typography level="body-sm">Apellido</Typography>
        <Typography level="body-lg" sx={{ p: 1, border: '1px solid', borderColor: 'neutral.300', borderRadius: 'sm' }}>
          {user.lastName}
        </Typography>
      </Box>
      
      <Box sx={{ width: '100%' }}>
        <Typography level="body-sm">RUT</Typography>
        <Typography level="body-lg" sx={{ p: 1, border: '1px solid', borderColor: 'neutral.300', borderRadius: 'sm' }}>
          {user.rut}
        </Typography>
      </Box>
      
      <Box sx={{ width: '100%' }}>
        <Typography level="body-sm">Correo</Typography>
        <Typography level="body-lg" sx={{ p: 1, border: '1px solid', borderColor: 'neutral.300', borderRadius: 'sm' }}>
          {user.email}
        </Typography>
      </Box>
      
      <Box sx={{ width: '100%' }}>
        <Typography level="body-sm">Cargo</Typography>
        <Typography level="body-lg" sx={{ p: 1, border: '1px solid', borderColor: 'neutral.300', borderRadius: 'sm' }}>
          {user.role}
        </Typography>
      </Box>
    </Box>
  );
};

export default UserViewForm;