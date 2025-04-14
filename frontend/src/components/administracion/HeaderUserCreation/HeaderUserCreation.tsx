import { Box, IconButton, Typography } from "@mui/joy";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface HeaderUserCreationProps {
  title?: string; // Propiedad opcional para personalizar el título
}

const HeaderUserCreation = ({ title = "Creación de Usuario" }: HeaderUserCreationProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px",
      }}
    >
      <IconButton onClick={() => window.history.back()} variant="plain" color="neutral" size="lg">
        <ArrowBackIcon />
      </IconButton>
      <Typography level="h2">
        {title} {/* Usa el título personalizado */}
      </Typography>
      <Box sx={{ width: "40px" }} /> {/* Espaciador para alinear el título */}
    </Box>
  );
};

export default HeaderUserCreation;