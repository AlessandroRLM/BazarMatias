import { Box, Sheet, Avatar } from "@mui/joy";
import HeaderUserCreation from "../../components/administracion/HeaderUserCreation/HeaderUserCreation";
import FormUserCreation from "../../components/administracion/FormUserCreation/FormUserCreation";

const UserCreation = () => {
  return (
      <Sheet
          variant="outlined"
          color="neutral"
          sx={{
              display: 'flex',
              flexDirection: 'column', // Asegura que los elementos se apilen verticalmente
              alignItems: 'center',
              justifyContent: 'flex-start', // Alinea el contenido al inicio
              position: 'relative',
              borderRadius: 'var(--joy-radius-md)',
              boxShadow: 'var(--joy-shadow-md)',
              width: '100%', // Asegura que ocupe todo el ancho disponible
              height: 'auto', // Cambiado de altura fija a dinámica
              maxHeight: '100vh', // Limita la altura al tamaño de la ventana
              overflow: 'auto', // Permite desplazamiento si el contenido excede la altura
          }}
      >
          <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                width: '100%', // Asegura que ocupe todo el ancho disponible
                height: 'auto', // Cambiado de altura fija a dinámica
                backgroundColor: '#ffffff',
                borderRadius: 'var(--joy-radius-md)',
                overflow: 'visible', // Permite que el contenido se ajuste dinámicamente
                gap: 2,
                border: '1px solid var(--theme-divider)',
                boxShadow: 'var(--joy-shadow-md)',
                paddingBottom: '16px', // Espacio en blanco debajo del formulario
            }}
          > 
            {/* Header */}
            <HeaderUserCreation />
            <Box
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, padding: 0 }}
            >
                <Avatar variant="soft" color="primary" size="profile" >AA</Avatar>
            </Box>
            {/* Formulario */}
            <FormUserCreation />
          </Box>  
      </Sheet>
  );
};

export default UserCreation;