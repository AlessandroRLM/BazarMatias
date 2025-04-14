import { Box, IconButton, Typography } from "@mui/joy";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ProfileHeader = () => {
    return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            padding: "8px",
          }}
        >
          <IconButton onClick={() => window.history.back()} variant="plain" color="neutral" size="lg">
            <ArrowBackIcon />
          </IconButton>
          <Typography level="h2">
            Detalles de Usuario
          </Typography>
          <Box sx={{ width: "40px" }} /> {/* Espaciador para alinear el título */}
        </Box>
      );
    };;

export default ProfileHeader;